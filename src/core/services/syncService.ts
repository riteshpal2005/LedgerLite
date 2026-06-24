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
import { useExpenseDatabase } from "../database/useExpenseDatabase";
import { Expense, Category, Account } from "../database/schema";
import { setExpenses } from "../store/expenseSlice";
import { setCategories } from "../store/categorySlice";
import { setAccounts } from "../store/accountSlice";
import { setIsGlobalSyncing } from "../store/settingsSlice";

let isSyncing = false;
let syncTimeout: NodeJS.Timeout | null = null;
let lastSyncTime = 0;
const SYNC_COOLDOWN_MS = 10000; // Ref: syncService-1

export const SyncService = {
  async pullFromFirebase(
    userId: string,
    dbActions: ReturnType<typeof useExpenseDatabase>,
  ) {
    if (isSyncing) return;
    isSyncing = true;

    try {
      const userDocRef = doc(db, "users", userId);
      const collectionsToSync = ["expenses", "categories", "accounts"];
      for (const col of collectionsToSync) {
        const q = query(collection(userDocRef, col));
        const snapshot = await getDocs(q);

        for (const document of snapshot.docs) {
          const data = document.data();

          const localData = { ...data, id: document.id, sync_status: "synced" };
          if (!document.id) continue; // Ref: syncService-1

          if (col === "expenses") {
            await dbActions.restoreExpense(localData as Expense);
          } else if (col === "categories") {
            await dbActions.restoreCategory(localData as Category);
          } else if (col === "accounts") {
            await dbActions.restoreAccount(localData as Account);
          }
        }
      }

      // Ref: syncService-2
      await dbActions.deleteCorruptedData();

      const expenses = await dbActions.getAllExpenses();
      const categories = await dbActions.getAllCategories();
      const accounts = await dbActions.getAllAccounts();
      store.dispatch(setExpenses(expenses));
      store.dispatch(setCategories(categories));
      store.dispatch(setAccounts(accounts));
    } catch (error) {
      console.error("[SyncService] Pull Failed:", error);
    } finally {
      isSyncing = false;
    }
  },
  schedulePush(
    userId: string,
    dbActions: ReturnType<typeof useExpenseDatabase>,
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
    dbActions: ReturnType<typeof useExpenseDatabase>,
  ) {
    if (isSyncing) return;
    isSyncing = true;

    try {
      const { getAllExpenses, getAllCategories, getAllAccounts } = dbActions;
      const expenses = await getAllExpenses();
      const categories = await getAllCategories();
      const accounts = await getAllAccounts();
      const pendingExpenses = expenses.filter(
        (e) => e.sync_status === "pending" || e.sync_status === "deleted",
      );
      const pendingCategories = categories.filter(
        (c) => c.sync_status === "pending" || c.sync_status === "deleted",
      );
      const pendingAccounts = accounts.filter(
        (a) => a.sync_status === "pending" || a.sync_status === "deleted",
      );

      if (
        pendingExpenses.length === 0 &&
        pendingCategories.length === 0 &&
        pendingAccounts.length === 0
      ) {
        isSyncing = false;
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
      for (const expense of pendingExpenses) {
        const docRef = doc(
          collection(userRef, "expenses"),
          expense.id.toString(),
        );
        if (expense.sync_status === "deleted") {
          batch.delete(docRef);
        } else {
          const { sync_status, ...remoteData } = expense;
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
      for (const expense of pendingExpenses) {
        await dbActions.markAsSynced("expenses", expense.id);
      }
    } catch (error) {
      console.error("[SyncService] Push Failed:", error);
    } finally {
      isSyncing = false;
    }
  },
  async syncAll(
    userId: string,
    dbActions: ReturnType<typeof useExpenseDatabase>,
  ) {
    const now = Date.now();
    if (now - lastSyncTime < SYNC_COOLDOWN_MS) {

      return;
    }

    store.dispatch(setIsGlobalSyncing(true));
    try {
      // Ref: syncService-3
      await this.pushToFirebase(userId, dbActions);
      // Ref: syncService-4
      await this.pullFromFirebase(userId, dbActions);
      lastSyncTime = Date.now();
    } finally {
      store.dispatch(setIsGlobalSyncing(false));
    }
  },
};
