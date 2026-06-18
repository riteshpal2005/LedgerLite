import { useSQLiteContext } from "expo-sqlite";

export type CategorySpending = {
  categoryId: number;
  totalSpent: number;
};

export function useAnalyticsDatabase() {
  const db = useSQLiteContext();

  const getExpensesByCategory = async (startDate: number, endDate: number) => {
    // Ref: analyticsQueries-1
    const result = await db.getAllAsync<CategorySpending>(
      `SELECT categoryId, SUM(amount) as totalSpent 
       FROM expenses 
       WHERE type = 'debit' AND date >= ? AND date <= ? 
       GROUP BY categoryId
       ORDER BY totalSpent DESC`,
      [startDate, endDate]
    );
    return result;
  };

  return { getExpensesByCategory };
}
