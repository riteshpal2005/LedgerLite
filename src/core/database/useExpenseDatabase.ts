import { useSQLiteContext } from "expo-sqlite";
import { Expense } from "./schema";

export function useExpenseDatabase() {
  const db = useSQLiteContext();

  const getAllExpenses = async () => {
    const result = await db.getAllAsync<Expense>('SELECT * FROM expenses ORDER BY date DESC');
    return result;
  }

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const result = await db.runAsync('INSERT INTO expenses (amount, description, date, categoryId, type) VALUES (?, ?, ?, ?, ?)', [expense.amount, expense.description, expense.date, expense.categoryId, expense.type]);
    return result.lastInsertRowId;
  };

  return { addExpense, getAllExpenses };
}


