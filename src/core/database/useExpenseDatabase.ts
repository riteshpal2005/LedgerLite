import { useSQLiteContext } from "expo-sqlite";
import { Expense, Category } from "./schema";

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
    const result = await db.runAsync('INSERT INTO expenses (amount, description, date, categoryId, type, merchant) VALUES (?, ?, ?, ?, ?, ?)', [expense.amount, expense.description, expense.date, expense.categoryId, expense.type, expense.merchant || null]);
    return result.lastInsertRowId;
  };

  return { addExpense, getAllExpenses, getTotalSpent, getAllCategories };
}


