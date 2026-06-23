import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system/legacy";
import { useExpenseDatabase } from "../database/useExpenseDatabase";
import { SyncService } from "./syncService";

export const MigrationService = {
  async migrateGuestDataToUser(
    userId: string,
    dbActions: ReturnType<typeof useExpenseDatabase>,
  ) {
    const guestDbName = "ledgerlite_guest.db";
    // Ref: migrationService-1
    const guestDbPath = `${FileSystem.documentDirectory}SQLite/${guestDbName}`;

    try {
      const fileInfo = await FileSystem.getInfoAsync(guestDbPath);
      if (!fileInfo.exists) {
        return;
      }

      // Ref: migrationService-2
      const guestDb = await SQLite.openDatabaseAsync(guestDbName);

      // Ref: migrationService-3
      const expenses = await guestDb.getAllAsync<any>(`SELECT * FROM expenses`);
      const categories = await guestDb.getAllAsync<any>(
        `SELECT * FROM categories`,
      );
      const accounts = await guestDb.getAllAsync<any>(`SELECT * FROM accounts`);

      await guestDb.closeAsync();

      // Ref: migrationService-4
      if (expenses.length > 0 || categories.length > 0 || accounts.length > 0) {
        // Ref: migrationService-5
        for (const account of accounts) {
          account.sync_status = "pending"; // Ref: migrationService-6
          await dbActions.restoreAccount(account);
        }

        // Ref: migrationService-7
        for (const category of categories) {
          category.sync_status = "pending"; // Ref: migrationService-8
          await dbActions.restoreCategory(category);
        }

        // Ref: migrationService-9
        for (const expense of expenses) {
          expense.sync_status = "pending"; // Ref: migrationService-10
          await dbActions.restoreExpense(expense);
        }

        // Ref: migrationService-11
        await SyncService.pushToFirebase(userId, dbActions);
      }

      // Ref: migrationService-12
    } catch (error) {
      console.error(`[MigrationService] Failed to migrate guest data:`, error);
    }
  },
};
