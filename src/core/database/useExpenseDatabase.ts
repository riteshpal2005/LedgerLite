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

  const updateExpenseAccount = async (expenseId: number, accountId: number) => {
    await db.runAsync('UPDATE expenses SET accountId = ? WHERE id = ?', [accountId, expenseId]);
  };

  return { addExpense, getAllExpenses, getTotalSpent, getAllCategories, getAllAccounts, addAccount, updateExpenseAccount };
}


