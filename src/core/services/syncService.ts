import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { store } from "../store/store";
import { useTransactionDatabase } from "../database/useTransactionDatabase";
import { Transaction, Category, Account } from "../database/schema";
import { setTransactions } from "../store/transactionSlice";
import { setCategories } from "../store/categorySlice";
import { setAccounts } from "../store/accountSlice";
import { setIsGlobalSyncing } from "../store/settingsSlice";
import { parseDateTime } from "./dataService";

let isPushing = false;
let isPulling = false;
let pushPending = false;
let syncTimeout: NodeJS.Timeout | null = null;
let lastSyncTime = 0;
const SYNC_COOLDOWN_MS = 10000;

export const SyncService = {
  resetSyncState() {
    isPushing = false;
    isPulling = false;
    lastSyncTime = 0;
  },
  async pullFromFirebase(
    userId: string,
    dbActions: ReturnType<typeof useTransactionDatabase>,
  ) {
    if (isPulling) return;
    isPulling = true;

    try {
      const userDocRef = doc(db, "users", userId);
      const collectionsToSync = ["transactions", "categories", "accounts"];
      for (const col of collectionsToSync) {
        const q = query(collection(userDocRef, col));
        const snapshot = await getDocs(q);

        for (const document of snapshot.docs) {
          const data = document.data();

          const localData = { ...data, id: document.id, sync_status: "synced" };
          if (!document.id) continue; // Ref: syncService-1

          if (col === "transactions") {
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
            await dbActions.restoreTransaction(transaction as Transaction);
          } else if (col === "categories") {
            await dbActions.restoreCategory(localData as Category);
          } else if (col === "accounts") {
            await dbActions.restoreAccount(localData as Account);
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
    dbActions: ReturnType<typeof useTransactionDatabase>,
  ) {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(async () => {
      await this.pushToFirebase(userId, dbActions);
    }, 3000);
  },
  async pushToFirebase(
    userId: string,
    dbActions: ReturnType<typeof useTransactionDatabase>,
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
      for (const account of pendingAccounts) {
        await dbActions.markAsSynced("accounts", account.id);
      }
      for (const category of pendingCategories) {
        await dbActions.markAsSynced("categories", category.id);
      }
      for (const transaction of pendingTransactions) {
        await dbActions.markAsSynced("transactions", transaction.id);
      }
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
    dbActions: ReturnType<typeof useTransactionDatabase>,
  ) {
    const now = Date.now();
    if (now - lastSyncTime < SYNC_COOLDOWN_MS) {

      return;
    }

    store.dispatch(setIsGlobalSyncing(true));
    try {
      await this.pushToFirebase(userId, dbActions);
      await this.pullFromFirebase(userId, dbActions);
      lastSyncTime = Date.now();
    } catch (error) {
      console.warn("Sync failed, not updating lastSyncTime");
    } finally {
      store.dispatch(setIsGlobalSyncing(false));
    }
  },
};
