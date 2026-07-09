import { useSQLiteContext } from "expo-sqlite";
import * as Crypto from "expo-crypto";
import { Transaction, Category, Account } from "./schema";

export function useTransactionDatabase() {
  const db = useSQLiteContext();

  const propagateForward = async (
    accountId: string,
    minDate: number,
    startRowid?: number,
    baseBalance?: number
  ) => {
    const account = await db.getFirstAsync<{ balance: number }>(
      "SELECT balance FROM accounts WHERE id = ?",
      [accountId]
    );
    if (!account) return;

    let runningBalance = baseBalance !== undefined ? baseBalance : account.balance;

    if (baseBalance === undefined) {
      const prevTx = await db.getFirstAsync<{ balance_after: number }>(
        `SELECT balance_after FROM transactions 
         WHERE accountId = ? AND sync_status != 'deleted' 
           AND (date < ? OR (date = ? AND rowid < ?))
         ORDER BY date DESC, rowid DESC LIMIT 1`,
        [accountId, minDate, minDate, startRowid || 0]
      );
      if (prevTx) {
        runningBalance = prevTx.balance_after;
      }
    }

    const nextTxs = await db.getAllAsync<{ id: string; amount: number; type: string; categoryId: string; balance_after?: number }>(
      `SELECT id, amount, type, categoryId, balance_after FROM transactions 
       WHERE accountId = ? AND sync_status != 'deleted'
         AND (date > ? OR (date = ? AND rowid >= ?))
       ORDER BY date ASC, rowid ASC`,
      [accountId, minDate, minDate, startRowid || 0]
    );

    for (const tx of nextTxs) {
      if (tx.categoryId !== 'uncategorized') {
        if (tx.type === "credit") {
          runningBalance += tx.amount;
        } else if (tx.type === "debit") {
          runningBalance -= tx.amount;
        }
      }

      if (tx.balance_after === undefined || tx.balance_after === null || Math.round(tx.balance_after * 100) !== Math.round(runningBalance * 100)) {
        await db.runAsync(
          "UPDATE transactions SET balance_after = ?, sync_status = ?, updated_at = ? WHERE id = ?",
          [runningBalance, "pending", Date.now(), tx.id]
        );
      }
    }
  };

  const getAllTransactions = async () => {
    const result = await db.getAllAsync<Transaction>(
      "SELECT * FROM transactions WHERE sync_status != 'deleted' ORDER BY date DESC",
    );
    return result;
  };

  const getTotalSpent = async () => {
    const result = await db.getFirstAsync<{ total: number }>(
      `SELECT SUM(amount) as total FROM transactions WHERE type = ? AND sync_status != 'deleted' AND categoryId != 'uncategorized'`,
      ["debit"],
    );
    return result?.total || 0;
  };

  const getAllCategories = async () => {
    const result = await db.getAllAsync<Category>("SELECT * FROM categories WHERE sync_status != 'deleted'");
    return result;
  };

  const updateCategory = async (
    id: string,
    category: Omit<Category, "id" | "sync_status" | "updated_at">,
  ) => {
    await db.runAsync(
      "UPDATE categories SET name = ?, icon = ?, color = ?, sync_status = ?, updated_at = ? WHERE id = ?",
      [category.name, category.icon, category.color, "pending", Date.now(), id],
    );
  };

  const addCategory = async (
    category: Omit<Category, "id" | "sync_status" | "updated_at">,
  ) => {
    const id = Crypto.randomUUID();
    const updated_at = Date.now();
    await db.runAsync(
      "INSERT INTO categories (id, name, icon, color, sync_status, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, category.name, category.icon, category.color, "pending", updated_at],
    );
    return id;
  };

  const restoreCategory = async (category: Category) => {
    await db.runAsync(
      "INSERT OR REPLACE INTO categories (id, name, icon, color, sync_status, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        category.id,
        category.name,
        category.icon,
        category.color,
        category.sync_status,
        category.updated_at,
      ],
    );
  };

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "sync_status" | "updated_at">,
  ) => {
    const id = Crypto.randomUUID();
    const updated_at = Date.now();
    await db.runAsync(
      "INSERT INTO transactions (id, amount, description, date, categoryId, type, merchant, accountId, balance_after, sync_status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        transaction.amount,
        transaction.description,
        transaction.date,
        transaction.categoryId,
        transaction.type,
        transaction.merchant || null,
        transaction.accountId || null,
        null,
        "pending",
        updated_at,
      ],
    );
    if (transaction.accountId) {
      const newTx = await db.getFirstAsync<{ rowid: number }>(
        "SELECT rowid FROM transactions WHERE id = ?",
        [id]
      );
      if (newTx) {
        await propagateForward(transaction.accountId, transaction.date, newTx.rowid);
      }
    }
    return id;
  };

  const addTransactionsBatch = async (
    transactionsList: Omit<Transaction, "id" | "sync_status" | "updated_at">[]
  ) => {
    await db.withTransactionAsync(async () => {
      const affectedAccounts = new Set<string>();
      const accountMinDates: Record<string, number> = {};
      const accountMinRowids: Record<string, number> = {};

      for (const transaction of transactionsList) {
        const id = Crypto.randomUUID();
        const updated_at = Date.now();
        await db.runAsync(
          "INSERT INTO transactions (id, amount, description, date, categoryId, type, merchant, accountId, balance_after, sync_status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            id,
            transaction.amount,
            transaction.description,
            transaction.date,
            transaction.categoryId,
            transaction.type,
            transaction.merchant || null,
            transaction.accountId || null,
            null,
            "pending",
            updated_at,
          ]
        );

        if (transaction.accountId) {
          affectedAccounts.add(transaction.accountId);
          const currentMinDate = accountMinDates[transaction.accountId] ?? Infinity;
          if (transaction.date < currentMinDate) {
            accountMinDates[transaction.accountId] = transaction.date;
          }
          if (!accountMinRowids[transaction.accountId] || transaction.date < currentMinDate) {
            const newRow = await db.getFirstAsync<{ rowid: number }>(
              "SELECT rowid FROM transactions WHERE id = ?",
              [id]
            );
            if (newRow) {
              accountMinRowids[transaction.accountId] = newRow.rowid;
            }
          }
        }
      }

      for (const accountId of affectedAccounts) {
        const minDate = accountMinDates[accountId];
        const minRowid = accountMinRowids[accountId] || 0;
        await propagateForward(accountId, minDate, minRowid);
      }
    });
  };

  const getAllAccounts = async () => {
    const result = await db.getAllAsync<Account>("SELECT * FROM accounts WHERE sync_status != 'deleted'");
    return result;
  };

  const addAccount = async (
    account: Omit<Account, "id" | "sync_status" | "updated_at">,
  ) => {
    const id = Crypto.randomUUID();
    const updated_at = Date.now();
    await db.runAsync(
      "INSERT INTO accounts (id, name, type, balance, sync_status, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, account.name, account.type, account.balance, "pending", updated_at],
    );
    return id;
  };

  const restoreAccount = async (account: Account) => {
    await db.runAsync(
      "INSERT OR REPLACE INTO accounts (id, name, type, balance, sync_status, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        account.id,
        account.name,
        account.type,
        account.balance,
        account.sync_status,
        account.updated_at,
      ],
    );
  };

  const updateAccount = async (
    id: string,
    account: Omit<Account, "id" | "sync_status" | "updated_at">,
  ) => {
    await db.runAsync(
      "UPDATE accounts SET name = ?, type = ?, balance = ?, sync_status = ?, updated_at = ? WHERE id = ?",
      [account.name, account.type, account.balance, "pending", Date.now(), id],
    );
  };

  const adjustAccountBalance = async (accountId: string, amount: number) => {
    await db.runAsync(
      "UPDATE accounts SET balance = balance + ?, sync_status = ?, updated_at = ? WHERE id = ?",
      [amount, "pending", Date.now(), accountId],
    );
    await propagateForward(accountId, 0);
  };

  const updateTransactionAccount = async (transactionId: string, accountId: string) => {
    const oldTransaction = await db.getFirstAsync<{ rowid: number; accountId: string; date: number }>(
      "SELECT rowid, accountId, date FROM transactions WHERE id = ?",
      [transactionId]
    );
    await db.runAsync(
      "UPDATE transactions SET accountId = ?, sync_status = ?, updated_at = ? WHERE id = ?",
      [accountId, "pending", Date.now(), transactionId],
    );
    const newTransactionRow = await db.getFirstAsync<{ rowid: number }>(
      "SELECT rowid FROM transactions WHERE id = ?",
      [transactionId]
    );

    if (oldTransaction) {
      if (oldTransaction.accountId === accountId) {
        if (accountId) {
          await propagateForward(accountId, oldTransaction.date, oldTransaction.rowid);
        }
      } else {
        if (oldTransaction.accountId) {
          await propagateForward(oldTransaction.accountId, oldTransaction.date, oldTransaction.rowid);
        }
        if (accountId && newTransactionRow) {
          await propagateForward(accountId, oldTransaction.date, newTransactionRow.rowid);
        }
      }
    }
  };

  const updateTransactionFull = async (
    id: string,
    transaction: Omit<Transaction, "id" | "sync_status" | "updated_at">,
  ) => {
    const oldTransaction = await db.getFirstAsync<{ rowid: number; accountId: string; date: number }>(
      "SELECT rowid, accountId, date FROM transactions WHERE id = ?",
      [id]
    );
    await db.runAsync(
      "UPDATE transactions SET amount = ?, description = ?, date = ?, categoryId = ?, type = ?, merchant = ?, accountId = ?, sync_status = ?, updated_at = ? WHERE id = ?",
      [
        transaction.amount,
        transaction.description,
        transaction.date,
        transaction.categoryId,
        transaction.type,
        transaction.merchant || null,
        transaction.accountId || null,
        "pending",
        Date.now(),
        id,
      ],
    );
    const newTransactionRow = await db.getFirstAsync<{ rowid: number }>(
      "SELECT rowid FROM transactions WHERE id = ?",
      [id]
    );

    if (oldTransaction) {
      if (oldTransaction.accountId === transaction.accountId) {
        if (transaction.accountId) {
          const minDate = Math.min(oldTransaction.date, transaction.date);
          const minRowid = minDate === oldTransaction.date ? oldTransaction.rowid : (newTransactionRow?.rowid || 0);
          await propagateForward(transaction.accountId, minDate, minRowid);
        }
      } else {
        if (oldTransaction.accountId) {
          await propagateForward(oldTransaction.accountId, oldTransaction.date, oldTransaction.rowid);
        }
        if (transaction.accountId && newTransactionRow) {
          await propagateForward(transaction.accountId, transaction.date, newTransactionRow.rowid);
        }
      }
    }
  };

  const restoreTransaction = async (transaction: Transaction) => {
    await db.runAsync(
      "INSERT OR REPLACE INTO transactions (id, amount, description, date, categoryId, type, merchant, accountId, balance_after, sync_status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        transaction.id,
        transaction.amount,
        transaction.description,
        transaction.date,
        transaction.categoryId,
        transaction.type,
        transaction.merchant || null,
        transaction.accountId || null,
        transaction.balance_after ?? null,
        transaction.sync_status,
        transaction.updated_at,
      ],
    );
  };

  const markAsSynced = async (
    table: "transactions" | "categories" | "accounts",
    id: string,
  ) => {
    const validTables = ["transactions", "categories", "accounts"];
    if (!validTables.includes(table)) return;
      let tableName = "transactions";
      switch(table) {
        case "accounts": tableName = "accounts"; break;
        case "categories": tableName = "categories"; break;
        case "transactions": tableName = "transactions"; break;
      }
      
      const result = await db.getFirstAsync<{ sync_status: string }>(
        `SELECT sync_status FROM ${tableName} WHERE id = ?`,
        [id],
      );
    if (result?.sync_status === "deleted") {
      await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, [id]);
    } else {
      await db.runAsync(
        `UPDATE ${table} SET sync_status = 'synced' WHERE id = ?`,
        [id],
      );
    }
  };

  const deleteCorruptedData = async () => {
    await db.runAsync(`DELETE FROM categories WHERE id IS NULL`);
    await db.runAsync(`DELETE FROM transactions WHERE id IS NULL`);
    await db.runAsync(`DELETE FROM accounts WHERE id IS NULL`);
    await db.runAsync(`DELETE FROM transactions WHERE accountId IS NOT NULL AND accountId NOT IN (SELECT id FROM accounts)`);
    await db.runAsync(`DELETE FROM transactions WHERE categoryId IS NOT NULL AND categoryId NOT IN (SELECT id FROM categories)`);
  };

  const getPendingSyncData = async () => {
    const pendingTransactions = await db.getAllAsync<Transaction>(
      "SELECT * FROM transactions WHERE sync_status IN ('pending', 'deleted')"
    );
    const pendingCategories = await db.getAllAsync<Category>(
      "SELECT * FROM categories WHERE sync_status IN ('pending', 'deleted')"
    );
    const pendingAccounts = await db.getAllAsync<Account>(
      "SELECT * FROM accounts WHERE sync_status IN ('pending', 'deleted')"
    );
    return { pendingTransactions, pendingCategories, pendingAccounts };
  };

  const deleteTransaction = async (id: string) => {
    const transaction = await db.getFirstAsync<{ rowid: number; accountId: string; date: number; categoryId: string; amount: number; type: string; description: string }>(
      "SELECT rowid, accountId, date, categoryId, amount, type, description FROM transactions WHERE id = ?",
      [id]
    );
    if (!transaction) return;

    await db.runAsync(
      "UPDATE transactions SET sync_status = ?, updated_at = ? WHERE id = ?",
      ["deleted", Date.now(), id],
    );
    if (transaction.accountId) {
      await propagateForward(transaction.accountId, transaction.date, transaction.rowid);
    }

    const selfTransferCat = await db.getFirstAsync<{ id: string }>(
      "SELECT id FROM categories WHERE name = 'Self Transfer'"
    );
    if (selfTransferCat && transaction.categoryId === selfTransferCat.id) {
      const oppositeType = transaction.type === "debit" ? "credit" : "debit";
      const partner = await db.getFirstAsync<{ id: string; rowid: number; accountId: string; date: number }>(
        `SELECT id, rowid, accountId, date FROM transactions 
         WHERE categoryId = ? AND type = ? AND ABS(amount - ?) < 0.001 
           AND abs(date - ?) <= 1000 AND sync_status != 'deleted' AND id != ?`,
        [transaction.categoryId, oppositeType, transaction.amount, transaction.date, id]
      );
      if (partner) {
        await db.runAsync(
          "UPDATE transactions SET sync_status = ?, updated_at = ? WHERE id = ?",
          ["deleted", Date.now(), partner.id],
        );
        if (partner.accountId) {
          await propagateForward(partner.accountId, partner.date, partner.rowid);
        }
      }
    }
  };

  const repairSelfTransfers = async () => {
    const selfTransferCat = await db.getFirstAsync<{ id: string }>(
      "SELECT id FROM categories WHERE name = 'Self Transfer'"
    );
    if (!selfTransferCat) return;

    const txs = await db.getAllAsync<{ id: string; amount: number; type: string; date: number; accountId: string }>(
      "SELECT id, amount, type, date, accountId FROM transactions WHERE categoryId = ? AND sync_status != 'deleted' ORDER BY date ASC, rowid ASC",
      [selfTransferCat.id]
    );

    const paired = new Set<string>();
    const affectedAccounts = new Set<string>();

    for (let i = 0; i < txs.length; i++) {
      const tx1 = txs[i];
      if (paired.has(tx1.id)) continue;

      for (let j = i + 1; j < txs.length; j++) {
        const tx2 = txs[j];
        if (paired.has(tx2.id)) continue;

        const isOpposite = tx1.type !== tx2.type;
        const isSameAmount = Math.round(tx1.amount * 100) === Math.round(tx2.amount * 100);
        const isSameTime = Math.abs(tx1.date - tx2.date) <= 1000;

        if (isOpposite && isSameAmount && isSameTime) {
          paired.add(tx1.id);
          paired.add(tx2.id);

          const debitTx = tx1.type === "debit" ? tx1 : tx2;
          const creditTx = tx1.type === "credit" ? tx1 : tx2;

          const baseDate = Math.min(tx1.date, tx2.date);
          const newDebitDate = baseDate;
          const newCreditDate = baseDate + 1;

          if (debitTx.date !== newDebitDate || creditTx.date !== newCreditDate) {
            await db.runAsync(
              "UPDATE transactions SET date = ?, sync_status = 'pending', updated_at = ? WHERE id = ?",
              [newDebitDate, Date.now(), debitTx.id]
            );
            await db.runAsync(
              "UPDATE transactions SET date = ?, sync_status = 'pending', updated_at = ? WHERE id = ?",
              [newCreditDate, Date.now(), creditTx.id]
            );
            if (debitTx.accountId) affectedAccounts.add(debitTx.accountId);
            if (creditTx.accountId) affectedAccounts.add(creditTx.accountId);
          }
          break;
        }
      }
    }

    for (const accId of affectedAccounts) {
      await propagateForward(accId, 0);
    }
  };

  const deleteAccount = async (id: string) => {
    await db.runAsync(
      "UPDATE accounts SET sync_status = ?, updated_at = ? WHERE id = ?",
      ["deleted", Date.now(), id],
    );
  };

  const deleteTransactionsByAccount = async (accountId: string) => {
    await db.runAsync(
      "UPDATE transactions SET sync_status = ?, updated_at = ? WHERE accountId = ?",
      ["deleted", Date.now(), accountId],
    );
    const accountCheck = await db.getFirstAsync(`SELECT id FROM accounts WHERE id = ? AND sync_status != 'deleted'`, [accountId]);
    if (accountCheck) {
      await propagateForward(accountId, 0);
    }
  };

  const reassignTransactions = async (
    oldAccountId: string,
    newAccountId: string,
  ) => {
    await db.runAsync(
      "UPDATE transactions SET accountId = ?, sync_status = ?, updated_at = ? WHERE accountId = ?",
      [newAccountId, "pending", Date.now(), oldAccountId],
    );
    await propagateForward(oldAccountId, 0);
    await propagateForward(newAccountId, 0);
  };

  const deleteCategory = async (id: string) => {
    await db.runAsync(
      "UPDATE categories SET sync_status = ?, updated_at = ? WHERE id = ?",
      ["deleted", Date.now(), id],
    );
  };

  const deleteTransactionsByCategory = async (categoryId: string) => {
    await db.runAsync(
      "UPDATE transactions SET sync_status = ?, updated_at = ? WHERE categoryId = ?",
      ["deleted", Date.now(), categoryId],
    );
  };

  const reassignTransactionsCategory = async (
    oldCategoryId: string,
    newCategoryId: string,
  ) => {
    await db.runAsync(
      "UPDATE transactions SET categoryId = ?, sync_status = ?, updated_at = ? WHERE categoryId = ?",
      [newCategoryId, "pending", Date.now(), oldCategoryId],
    );
  };

  return {
    addTransaction,
    addTransactionsBatch,
    getAllTransactions,
    getTotalSpent,
    getAllCategories,
    updateCategory,
    addCategory,
    restoreCategory,
    deleteCategory,
    deleteTransactionsByCategory,
    reassignTransactionsCategory,
    getAllAccounts,
    addAccount,
    restoreAccount,
    updateAccount,
    adjustAccountBalance,
    updateTransactionAccount,
    updateTransactionFull,
     deleteTransaction,
     repairSelfTransfers,
     deleteAccount,
     deleteTransactionsByAccount,
     reassignTransactions,
     restoreTransaction,
     markAsSynced,
     deleteCorruptedData,
     getPendingSyncData,
   };
 }
