import {
  collection,
  query,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { store } from "../../store/store";
import { Transaction, Category, Account, DatabaseActions } from "../db/schema";
import { TransactionSchema, CategorySchema, AccountSchema } from "../../utils/validation";
import { setTransactions } from "../../store/transactionSlice";
import { setCategories } from "../../store/categorySlice";
import { setAccounts } from "../../store/accountSlice";
import { setIsGlobalSyncing } from "../../store/settingsSlice";
import { storage } from "../../utils/storage";

let isPushing = false;
let isPulling = false;
let pushPending = false;
let syncTimeout: ReturnType<typeof setTimeout> | null = null;
let lastSyncTime = storage.getNumber('lastSyncTime') || 0;
const SYNC_COOLDOWN_MS = 10000;

export const SyncService = {
  resetSyncState() {
    isPushing = false;
    isPulling = false;
    lastSyncTime = 0;
    storage.set('lastSyncTime', 0);
    if (syncTimeout) {
      clearTimeout(syncTimeout);
      syncTimeout = null;
    }
  },
  async pullFromFirebase(
    userId: string,
    dbActions: DatabaseActions,
  ) {
    if (isPulling) return;
    isPulling = true;

    try {
      const userDocRef = doc(db, "users", userId);
      const collectionsToSync = ["transactions", "expenses", "categories", "accounts"];
      for (const col of collectionsToSync) {
        const q = query(collection(userDocRef, col));
        const snapshot = await getDocs(q);

        for (const document of snapshot.docs) {
          const data = document.data();

          const localData = { ...data, id: document.id, sync_status: "synced" };
          if (!document.id) continue; // Ref: syncService-1

          if (col === "transactions" || col === "expenses") {
            const transaction = { ...localData } as any;
            if (transaction.date !== undefined && transaction.date !== null) {
              const d = transaction.date;
              if (typeof d === "number") {
                transaction.date = d < 10_000_000_000 ? d * 1000 : d;
              } else if (typeof d === "string" && /^\d+$/.test(d)) {
                const n = Number(d);
                transaction.date = n < 10_000_000_000 ? n * 1000 : n;
              } else {
                transaction.date = new Date(d).getTime() || Date.now();
              }
            }
            try {
              TransactionSchema.parse(transaction);
              await dbActions.restoreTransaction(transaction as Transaction);
            } catch (e) {
              console.warn(`[SyncService] Invalid transaction skipped: ${transaction.id}`, e);
            }
          } else if (col === "categories") {
            try {
              CategorySchema.parse(localData);
              await dbActions.restoreCategory(localData as Category);
            } catch (e) {
              console.warn(`[SyncService] Invalid category skipped: ${localData.id}`, e);
            }
          } else if (col === "accounts") {
            try {
              AccountSchema.parse(localData);
              await dbActions.restoreAccount(localData as Account);
            } catch (e) {
              console.warn(`[SyncService] Invalid account skipped: ${localData.id}`, e);
            }
          }
        }
      }


      await dbActions.deleteCorruptedData();

      const transactions = await dbActions.getAllTransactions();
      const categories = await dbActions.getAllCategories();
      const accounts = await dbActions.getAllAccounts();
      store.dispatch(setTransactions(transactions));
      store.dispatch(setCategories(categories));
      store.dispatch(setAccounts(accounts));
    } catch (error) {
      console.error("[SyncService] Pull Failed:", error);
      throw error;
    } finally {
      isPulling = false;
    }
  },
  schedulePush(
    userId: string,
    dbActions: DatabaseActions,
  ) {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(async () => {
      try {
        await this.pushToFirebase(userId, dbActions);
      } catch (e) {
        console.warn("[SyncService] Scheduled push aborted:", e);
      }
    }, 3000);
  },
  async pushToFirebase(
    userId: string,
    dbActions: DatabaseActions,
  ) {
    if (isPushing) {
      pushPending = true;
      return;
    }
    isPushing = true;
    pushPending = false;
    try {
      const { getPendingSyncData } = dbActions;
      const { pendingTransactions, pendingCategories, pendingAccounts } = await getPendingSyncData();

      if (
        pendingTransactions.length === 0 &&
        pendingCategories.length === 0 &&
        pendingAccounts.length === 0
      ) {
        isPushing = false;
        return;
      }

      const batch = writeBatch(db);
      const userRef = doc(db, "users", userId);

      for (const account of pendingAccounts) {
        const docRef = doc(
          collection(userRef, "accounts"),
          account.id.toString(),
        );
        if (account.sync_status === "deleted") {
          batch.delete(docRef);
        } else {
          const { sync_status, ...remoteData } = account;
          batch.set(docRef, remoteData, { merge: true });
        }
      }
      for (const category of pendingCategories) {
        const docRef = doc(
          collection(userRef, "categories"),
          category.id.toString(),
        );
        if (category.sync_status === "deleted") {
          batch.delete(docRef);
        } else {
          const { sync_status, ...remoteData } = category;
          batch.set(docRef, remoteData, { merge: true });
        }
      }
      for (const transaction of pendingTransactions) {
        const docRef = doc(
          collection(userRef, "transactions"),
          transaction.id.toString(),
        );
        if (transaction.sync_status === "deleted") {
          batch.delete(docRef);
        } else {
          const { sync_status, ...remoteData } = transaction;
          batch.set(docRef, remoteData, { merge: true });
        }
      }
      await batch.commit();
      
      const updates: { table: "transactions" | "categories" | "accounts"; id: string }[] = [];
      for (const account of pendingAccounts) {
        updates.push({ table: "accounts", id: account.id });
      }
      for (const category of pendingCategories) {
        updates.push({ table: "categories", id: category.id });
      }
      for (const transaction of pendingTransactions) {
        updates.push({ table: "transactions", id: transaction.id });
      }
      await dbActions.markMultipleAsSynced(updates);
    } catch (error) {
      console.error("[SyncService] Push Failed:", error);
      throw error;
    } finally {
      isPushing = false;
      if (pushPending) {
        this.schedulePush(userId, dbActions);
      }
    }
  },
  async syncAll(
    userId: string,
    dbActions: DatabaseActions,
  ) {
    // Temporarily disabled during WatermelonDB migration
    return;
    const now = Date.now();
    if (now - lastSyncTime < SYNC_COOLDOWN_MS) {

      return;
    }

    store.dispatch(setIsGlobalSyncing(true));
    try {
      await this.pushToFirebase(userId, dbActions);
      await this.pullFromFirebase(userId, dbActions);
      lastSyncTime = Date.now();
      storage.set('lastSyncTime', lastSyncTime);
    } catch (error) {
      console.warn("Sync failed, not updating lastSyncTime");
    } finally {
      store.dispatch(setIsGlobalSyncing(false));
    }
  },
};
