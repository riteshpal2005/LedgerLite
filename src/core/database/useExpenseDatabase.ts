import { useSQLiteContext } from "expo-sqlite";
import { Expense, Category, Account } from "./schema";

export function useExpenseDatabase() {
  const db = useSQLiteContext();

  const getAllExpenses = async () => {
    const result = await db.getAllAsync<Expense>('SELECT * FROM expenses ORDER BY date DESC');
    return result;
  };

  const getTotalSpent = async () => {
    const result = await db.getFirstAsync<{ total: number }>(
      `SELECT SUM(amount) as total FROM expenses WHERE type = ?`, ['debit']
    );
    return result?.total || 0;
  };

  const getAllCategories = async () => {
    const result = await db.getAllAsync<Category>('SELECT * FROM categories');
    return result;
  };

  const updateCategory = async (id: number, category: Omit<Category, 'id'>) => {
    await db.runAsync(
      'UPDATE categories SET name = ?, icon = ?, color = ? WHERE id = ?',
      [category.name, category.icon, category.color, id]
    );
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const result = await db.runAsync(
      'INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)',
      [category.name, category.icon, category.color]
    );
    return result.lastInsertRowId;
  };

  const restoreCategory = async (category: Category) => {
    await db.runAsync(
      'INSERT OR REPLACE INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
      [category.id, category.name, category.icon, category.color]
    );
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    // Ref: useExpenseDatabase-1
    const result = await db.runAsync(
      'INSERT INTO expenses (amount, description, date, categoryId, type, merchant, accountId) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [expense.amount, expense.description, expense.date, expense.categoryId, expense.type, expense.merchant || null, expense.accountId || null]
    );
    return result.lastInsertRowId;
  };

  const getAllAccounts = async () => {
    const result = await db.getAllAsync<Account>('SELECT * FROM accounts');
    return result;
  };

  const addAccount = async (account: Omit<Account, 'id'>) => {
    const result = await db.runAsync(
      'INSERT INTO accounts (name, type, balance) VALUES (?, ?, ?)',
      [account.name, account.type, account.balance]
    );
    return result.lastInsertRowId;
  };

  const restoreAccount = async (account: Account) => {
    await db.runAsync(
      'INSERT OR REPLACE INTO accounts (id, name, type, balance) VALUES (?, ?, ?, ?)',
      [account.id, account.name, account.type, account.balance]
    );
  };

  const updateAccount = async (id: number, account: Omit<Account, 'id'>) => {
    await db.runAsync(
      'UPDATE accounts SET name = ?, type = ?, balance = ? WHERE id = ?',
      [account.name, account.type, account.balance, id]
    );
  };

  const adjustAccountBalance = async (accountId: number, amount: number) => {
    await db.runAsync(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, accountId]
    );
  };

  const updateExpenseAccount = async (expenseId: number, accountId: number) => {
    await db.runAsync('UPDATE expenses SET accountId = ? WHERE id = ?', [accountId, expenseId]);
  };

  const updateExpenseFull = async (id: number, expense: Omit<Expense, 'id'>) => {
    await db.runAsync(
      'UPDATE expenses SET amount = ?, description = ?, date = ?, categoryId = ?, type = ?, merchant = ?, accountId = ? WHERE id = ?',
      [expense.amount, expense.description, expense.date, expense.categoryId, expense.type, expense.merchant || null, expense.accountId || null, id]
    );
  };

  const deleteExpense = async (id: number) => {
    await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
  };

  const deleteAccount = async (id: number) => {
    await db.runAsync('DELETE FROM accounts WHERE id = ?', [id]);
  };

  const deleteExpensesByAccount = async (accountId: number) => {
    await db.runAsync('DELETE FROM expenses WHERE accountId = ?', [accountId]);
  };

  const reassignExpenses = async (oldAccountId: number, newAccountId: number) => {
    await db.runAsync('UPDATE expenses SET accountId = ? WHERE accountId = ?', [newAccountId, oldAccountId]);
  };

  return { addExpense, getAllExpenses, getTotalSpent, getAllCategories, updateCategory, addCategory, restoreCategory, getAllAccounts, addAccount, restoreAccount, updateAccount, adjustAccountBalance, updateExpenseAccount, updateExpenseFull, deleteExpense, deleteAccount, deleteExpensesByAccount, reassignExpenses };
}


