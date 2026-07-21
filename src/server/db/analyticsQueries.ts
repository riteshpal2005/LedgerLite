import { useSQLiteContext } from "expo-sqlite";

export type CategorySpending = {
  categoryId: string;
  totalSpent: number;
};

export function useAnalyticsDatabase() {
  const db = useSQLiteContext();

  const getTransactionsByCategory = async (startDate: number, endDate: number) => {
    const result = await db.getAllAsync<CategorySpending>(
      `SELECT categoryId, SUM(amount) as totalSpent 
       FROM transactions 
       WHERE type = 'debit' AND sync_status != 'deleted' AND categoryId != 'uncategorized' AND date >= ? AND date <= ? 
       GROUP BY categoryId
       ORDER BY totalSpent DESC`,
      [startDate, endDate]
    );
    return result;
  };

  return { getTransactionsByCategory };
}