import { View, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { useAnalyticsDatabase, CategorySpending } from "../../features/analytics/db/analyticsQueries";
import { AnalyticsFilter } from "../../features/analytics/components/AnalyticsFilter";
import { ExpensePieChart } from "../../features/analytics/components/ExpensePieChart";

export default function AnalyticsScreen() {
  const [spendingData, setSpendingData] = useState<CategorySpending[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  // Ref: analytics-1
  const [dateRange, setDateRange] = useState<{start: number, end: number} | null>(null);

  const { getExpensesByCategory } = useAnalyticsDatabase();

  const loadData = useCallback(async () => {
    if (!dateRange) return;
    const data = await getExpensesByCategory(dateRange.start, dateRange.end);
    setSpendingData(data);
    const total = data.reduce((sum, item) => sum + item.totalSpent, 0);
    setTotalSpent(total);
  }, [dateRange]);

  // Ref: analytics-2
  useFocusEffect(useCallback(() => {
    loadData();
  }, [loadData]));

  return (
    <View className="flex-1 p-6 pt-12 bg-zinc-950">
      <Text className="text-white text-3xl font-bold mb-4">Analytics</Text>
      
      <AnalyticsFilter 
        onDateRangeChange={(start, end) => setDateRange({start, end})} 
      />

      <View className="bg-blue-600 rounded-3xl p-6 mb-8 shadow-lg">
        <Text className="text-blue-200 text-lg font-semibold mb-2">Total Spent (Filtered)</Text>
        <Text className="text-white text-5xl font-bold">₹{totalSpent.toFixed(2)}</Text>
      </View>
      
      <Text className="text-xl font-bold text-white mb-4">Spending by Category</Text>
      <ExpensePieChart spendingData={spendingData} />
    </View>
  );
}