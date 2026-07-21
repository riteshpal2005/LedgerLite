import * as SQLite from "expo-sqlite";
import { Paths, File } from "expo-file-system";
import { SyncService } from "./syncService";
import { Transaction, Category, Account, DatabaseActions } from "../db/schema";

export const MigrationService = {
  async migrateGuestDataToUser(
  userId: string,
  dbActions: DatabaseActions)
  {
    const guestDbName = "ledgerlite_guest.db";

    const guestDbPath = Paths.document.uri + "SQLite/" + guestDbName;

    try {
      const file = new File(guestDbPath);
      if (!file.exists) {
        return;
      }


      const guestDb = await SQLite.openDatabaseAsync(guestDbName);


      const transactions = await guestDb.getAllAsync<Transaction>(`SELECT * FROM transactions`);
      const categories = await guestDb.getAllAsync<Category>(
        `SELECT * FROM categories`
      );
      const accounts = await guestDb.getAllAsync<Account>(`SELECT * FROM accounts`);

      await guestDb.closeAsync();


      if (transactions.length > 0 || categories.length > 0 || accounts.length > 0) {

        for (const account of accounts) {
          account.sync_status = "pending";
          await dbActions.restoreAccount(account);
        }


        for (const category of categories) {
          category.sync_status = "pending";
          await dbActions.restoreCategory(category);
        }


        for (const transaction of transactions) {
          transaction.sync_status = "pending";
          await dbActions.restoreTransaction(transaction);
        }


        await SyncService.pushToFirebase(userId, dbActions);
      }

      file.delete();

    } catch (error) {
      console.error(`[MigrationService] Failed to migrate guest data:`, error);
    }
  }
};