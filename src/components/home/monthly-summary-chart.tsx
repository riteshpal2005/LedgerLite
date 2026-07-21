import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { withDatabase } from "@nozbe/watermelondb/react";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import Transaction from "../../server/db/models/Transaction";
import Category from "../../server/db/models/Category";
import { Q } from "@nozbe/watermelondb";
import { useCurrency } from "../../hooks/useCurrency";

function MonthlySummaryChartComponent({ transactions, categories }: {transactions: Transaction[];categories: Category[];}) {
  const router = useRouter();
  const { formatCurrency } = useCurrency();

  const { totalExpense, categoryTotals } = useMemo(() => {
    let total = 0;
    const totals: Record<string, number> = {};

    transactions.forEach((tx) => {
      total += tx.amount;
      const catId = (tx as any)._raw.category_id;
      if (catId) {
        totals[catId] = (totals[catId] || 0) + tx.amount;
      }
    });

    const categoryData = categories.
    filter((c) => totals[c.id] > 0).
    map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color || "#6b7280",
      amount: totals[c.id],
      percentage: total > 0 ? Math.round(totals[c.id] / total * 100) : 0
    })).
    sort((a, b) => b.amount - a.amount);

    return { totalExpense: total, categoryTotals: categoryData };
  }, [transactions, categories]);


  const CIRCUMFERENCE = 440;

  return (
    <View>
      <View className="flex-row justify-between items-end mb-4">
        <Text className="text-white text-lg font-bold">Spending by Category</Text>
        <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/analytics")}>
          <Text className="text-[#6642f8] text-sm font-bold mr-1">View analytics</Text>
          <Ionicons name="chevron-forward" size={16} color="#6642f8" />
        </TouchableOpacity>
      </View>

      <View className="bg-[#0f1011] rounded-2xl p-5 mb-8 flex-row items-center">
        <View className="w-40 h-40 relative justify-center items-center">
            <Svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: [{ rotate: '-90deg' }] }}>
              {categoryTotals.map((cat, index) => {
              const previousTotal = categoryTotals.slice(0, index).reduce((sum, c) => sum + c.amount, 0);

              const CIRCUM = 2 * Math.PI * 45;
              const strokeLength = totalExpense > 0 ? cat.amount / totalExpense * CIRCUM : 0;
              const offset = totalExpense > 0 ? previousTotal / totalExpense * CIRCUM : 0;

              return (
                <Circle
                  key={cat.id}
                  cx="60" cy="60" r="45"
                  stroke={cat.color}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${strokeLength} ${CIRCUM}`}
                  strokeDashoffset={-offset} />);


            })}
            </Svg>
            <View className="absolute items-center justify-center">
               <Text className="text-white text-lg font-bold">{formatCurrency(totalExpense)}</Text>
               <Text className="text-gray-400 text-[10px] mt-1">Total Expense</Text>
            </View>
        </View>
        
        <View className="flex-1 ml-6">
          {categoryTotals.slice(0, 6).map((cat) =>
          <View key={cat.id} className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center flex-1">
                <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
                <Text className="text-gray-300 text-xs flex-1" numberOfLines={1}>{cat.name}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-white text-xs mr-2">{formatCurrency(cat.amount)}</Text>
                <Text className="text-gray-500 text-xs w-8 text-right">{cat.percentage}%</Text>
              </View>
            </View>
          )}
          {categoryTotals.length === 0 &&
          <Text className="text-gray-500 text-xs">No expenses found.</Text>
          }
        </View>
      </View>
    </View>);

}

export const MonthlySummaryChart = withDatabase(
  withObservables([], ({ database }: any) => ({
    transactions: database.collections.get('transactions').query(
      Q.where('sync_status', Q.notEq('deleted')),
      Q.where('type', 'debit')
    ).observe(),
    categories: database.collections.get('categories').query(
      Q.where('sync_status', Q.notEq('deleted'))
    ).observe()
  }))(MonthlySummaryChartComponent)
);