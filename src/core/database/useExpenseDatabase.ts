import { useSQLiteContext } from "expo-sqlite";
import * as Crypto from "expo-crypto";
import { Expense, Category, Account } from "./schema";

export function useExpenseDatabase() {
  const db = useSQLiteContext();

  const recalculateBalancesForAccount = async (accountId: string) => {
    const account = await db.getFirstAsync<{ balance: number }>(
      "SELECT balance FROM accounts WHERE id = ?",
      [accountId]
    );
    if (!account) return;

    const accountExpenses = await db.getAllAsync<{ id: string; amount: number; type: string; balance_after?: number }>(
      "SELECT id, amount, type, balance_after FROM expenses WHERE accountId = ? AND sync_status != 'deleted' ORDER BY date ASC, id ASC",
      [accountId]
    );

    let runningBalance = account.balance;
    for (const expense of accountExpenses) {
      if (expense.type === "credit") {
        runningBalance += expense.amount;
      } else if (expense.type === "debit") {
        runningBalance -= expense.amount;
      }

      if (expense.balance_after !== runningBalance) {
        await db.runAsync(
          "UPDATE expenses SET balance_after = ?, sync_status = ?, updated_at = ? WHERE id = ?",
          [runningBalance, "pending", Date.now(), expense.id]
        );
      }
    }
  };

  const getAllExpenses = async () => {
    const result = await db.getAllAsync<Expense>(
      "SELECT * FROM expenses ORDER BY date DESC",
    );
    return result;
  };

  const getTotalSpent = async () => {
    const result = await db.getFirstAsync<{ total: number }>(
      `SELECT SUM(amount) as total FROM expenses WHERE type = ?`,
      ["debit"],
    );
    return result?.total || 0;
  };

  const getAllCategories = async () => {
    const result = await db.getAllAsync<Category>("SELECT * FROM categories");
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

  const addExpense = async (
    expense: Omit<Expense, "id" | "sync_status" | "updated_at">,
  ) => {
    const id = Crypto.randomUUID();
    const updated_at = Date.now();
    await db.runAsync(
      "INSERT INTO expenses (id, amount, description, date, categoryId, type, merchant, accountId, balance_after, sync_status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        expense.amount,
        expense.description,
        expense.date,
        expense.categoryId,
        expense.type,
        expense.merchant || null,
        expense.accountId || null,
        null,
        "pending",
        updated_at,
      ],
    );
    if (expense.accountId) {
      await recalculateBalancesForAccount(expense.accountId);
    }
    return id;
  };

  const getAllAccounts = async () => {
    const result = await db.getAllAsync<Account>("SELECT * FROM accounts");
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
    await recalculateBalancesForAccount(accountId);
  };

  const updateExpenseAccount = async (expenseId: string, accountId: string) => {
    const oldExpense = await db.getFirstAsync<{ accountId: string }>(
      "SELECT accountId FROM expenses WHERE id = ?",
      [expenseId]
    );
    await db.runAsync(
      "UPDATE expenses SET accountId = ?, sync_status = ?, updated_at = ? WHERE id = ?",
      [accountId, "pending", Date.now(), expenseId],
    );
    if (accountId) {
      await recalculateBalancesForAccount(accountId);
    }
    if (oldExpense?.accountId && oldExpense.accountId !== accountId) {
      await recalculateBalancesForAccount(oldExpense.accountId);
    }
  };

  const updateExpenseFull = async (
    id: string,
    expense: Omit<Expense, "id" | "sync_status" | "updated_at">,
  ) => {
    const oldExpense = await db.getFirstAsync<{ accountId: string }>(
      "SELECT accountId FROM expenses WHERE id = ?",
      [id]
    );
    await db.runAsync(
      "UPDATE expenses SET amount = ?, description = ?, date = ?, categoryId = ?, type = ?, merchant = ?, accountId = ?, sync_status = ?, updated_at = ? WHERE id = ?",
      [
        expense.amount,
        expense.description,
        expense.date,
        expense.categoryId,
        expense.type,
        expense.merchant || null,
        expense.accountId || null,
        "pending",
        Date.now(),
        id,
      ],
    );
    if (expense.accountId) {
      await recalculateBalancesForAccount(expense.accountId);
    }
    if (oldExpense?.accountId && oldExpense.accountId !== expense.accountId) {
      await recalculateBalancesForAccount(oldExpense.accountId);
    }
  };

  const restoreExpense = async (expense: Expense) => {
    await db.runAsync(
      "INSERT OR REPLACE INTO expenses (id, amount, description, date, categoryId, type, merchant, accountId, balance_after, sync_status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        expense.id,
        expense.amount,
        expense.description,
        expense.date,
        expense.categoryId,
        expense.type,
        expense.merchant || null,
        expense.accountId || null,
        expense.balance_after || null,
        expense.sync_status,
        expense.updated_at,
      ],
    );
  };

  const markAsSynced = async (
    table: "expenses" | "categories" | "accounts",
    id: string,
  ) => {
    const result = await db.getFirstAsync<{ sync_status: string }>(
      `SELECT sync_status FROM ${table} WHERE id = ?`,
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
    await db.runAsync(`DELETE FROM expenses WHERE id IS NULL`);
    await db.runAsync(`DELETE FROM accounts WHERE id IS NULL`);
  };

  const deleteExpense = async (id: string) => {
    const expense = await db.getFirstAsync<{ accountId: string }>(
      "SELECT accountId FROM expenses WHERE id = ?",
      [id]
    );
    await db.runAsync(
      "UPDATE expenses SET sync_status = ?, updated_at = ? WHERE id = ?",
      ["deleted", Date.now(), id],
    );
    if (expense?.accountId) {
      await recalculateBalancesForAccount(expense.accountId);
    }
  };

  const deleteAccount = async (id: string) => {
    await db.runAsync(
      "UPDATE accounts SET sync_status = ?, updated_at = ? WHERE id = ?",
      ["deleted", Date.now(), id],
    );
  };

  const deleteExpensesByAccount = async (accountId: string) => {
    await db.runAsync(
      "UPDATE expenses SET sync_status = ?, updated_at = ? WHERE accountId = ?",
      ["deleted", Date.now(), accountId],
    );
    await recalculateBalancesForAccount(accountId);
  };

  const reassignExpenses = async (
    oldAccountId: string,
    newAccountId: string,
  ) => {
    await db.runAsync(
      "UPDATE expenses SET accountId = ?, sync_status = ?, updated_at = ? WHERE accountId = ?",
      [newAccountId, "pending", Date.now(), oldAccountId],
    );
    await recalculateBalancesForAccount(oldAccountId);
    await recalculateBalancesForAccount(newAccountId);
  };

  const deleteCategory = async (id: string) => {
    await db.runAsync(
      "UPDATE categories SET sync_status = ?, updated_at = ? WHERE id = ?",
      ["deleted", Date.now(), id],
    );
  };

  const deleteExpensesByCategory = async (categoryId: string) => {
    await db.runAsync(
      "UPDATE expenses SET sync_status = ?, updated_at = ? WHERE categoryId = ?",
      ["deleted", Date.now(), categoryId],
    );
  };

  const reassignExpensesCategory = async (
    oldCategoryId: string,
    newCategoryId: string,
  ) => {
    await db.runAsync(
      "UPDATE expenses SET categoryId = ?, sync_status = ?, updated_at = ? WHERE categoryId = ?",
      [newCategoryId, "pending", Date.now(), oldCategoryId],
    );
  };

  return {
    addExpense,
    getAllExpenses,
    getTotalSpent,
    getAllCategories,
    updateCategory,
    addCategory,
    restoreCategory,
    deleteCategory,
    deleteExpensesByCategory,
    reassignExpensesCategory,
    getAllAccounts,
    addAccount,
    restoreAccount,
    updateAccount,
    adjustAccountBalance,
    updateExpenseAccount,
    updateExpenseFull,
    deleteExpense,
    deleteAccount,
    deleteExpensesByAccount,
    reassignExpenses,
    restoreExpense,
    markAsSynced,
    deleteCorruptedData,
  };
}
