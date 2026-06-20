import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Expense, Category, Account } from "../database/schema";

export interface CloudSnapshot {
  timestamp: number;
  expenses: Expense[];
  categories: Category[];
  accounts: Account[];
  settings: any;
}

export const SyncService = {
  /**
   * Upload all local data to Firestore
   */
  async syncToCloud(userId: string, snapshot: CloudSnapshot) {
    try {
      const docRef = doc(db, "users", userId, "data", "latest");
      await setDoc(docRef, snapshot);
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Cloud Sync Error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Download the latest snapshot from Firestore
   */
  async restoreFromCloud(userId: string): Promise<{ snapshot: CloudSnapshot | null, error: string | null }> {
    try {
      const docRef = doc(db, "users", userId, "data", "latest");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { snapshot: docSnap.data() as CloudSnapshot, error: null };
      } else {
        return { snapshot: null, error: "No cloud backup found for this account." };
      }
    } catch (error: any) {
      console.error("Cloud Restore Error:", error);
      return { snapshot: null, error: error.message };
    }
  }
};
