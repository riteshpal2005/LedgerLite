import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system/legacy";
import { useTransactionDatabase } from "../database/useTransactionDatabase";
import { SyncService } from "./syncService";

export const MigrationService = {
  async migrateGuestDataToUser(
    userId: string,
    dbActions: ReturnType<typeof useTransactionDatabase>,
  ) {
    const guestDbName = "ledgerlite_guest.db";

    const guestDbPath = `${FileSystem.documentDirectory}SQLite/${guestDbName}`;

    try {
      const fileInfo = await FileSystem.getInfoAsync(guestDbPath);
      if (!fileInfo.exists) {
        return;
      }


      const guestDb = await SQLite.openDatabaseAsync(guestDbName);


      const transactions = await guestDb.getAllAsync<any>(`SELECT * FROM transactions`);
      const categories = await guestDb.getAllAsync<any>(
        `SELECT * FROM categories`,
      );
      const accounts = await guestDb.getAllAsync<any>(`SELECT * FROM accounts`);

      await guestDb.closeAsync();


      if (transactions.length > 0 || categories.length > 0 || accounts.length > 0) {

        for (const account of accounts) {
          account.sync_status = "pending"; // Ref: migrationService-6
          await dbActions.restoreAccount(account);
        }


        for (const category of categories) {
          category.sync_status = "pending"; // Ref: migrationService-8
          await dbActions.restoreCategory(category);
        }


        for (const transaction of transactions) {
          transaction.sync_status = "pending"; // Ref: migrationService-10
          await dbActions.restoreTransaction(transaction);
        }


        await SyncService.pushToFirebase(userId, dbActions);
      }

      await FileSystem.deleteAsync(guestDbPath, { idempotent: true });

    } catch (error) {
      console.error(`[MigrationService] Failed to migrate guest data:`, error);
    }
  },
};
