import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";
import Category from "../../server/db/models/Category";
import { useCurrency } from "../../hooks/useCurrency";

interface CategorySpendingChartProps {
  transactions: Transaction[];
  categories: Category[];
  dateLabel?: string;
}


const CategorySpendingChartComponent = ({ transactions, categories, dateLabel = "This Month" }: CategorySpendingChartProps) => {
  const chartData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'debit');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    if (totalExpense === 0) return { totalExpense: 0, slices: [] };

    const categoryTotals: Record<string, number> = {};
    expenses.forEach((t) => {
      const catId = (t as any)._raw.category_id;
      if (!categoryTotals[catId]) categoryTotals[catId] = 0;
      categoryTotals[catId] += t.amount;
    });



    const sortedCategories = Object.entries(categoryTotals).
    map(([id, amount]) => ({
      id,
      amount,
      cat: categories.find((c) => c.id === id)
    })).
    sort((a, b) => b.amount - a.amount);

    let finalCategories = sortedCategories;
    if (sortedCategories.length > 4) {
      const top4 = sortedCategories.slice(0, 4);
      const otherAmount = sortedCategories.slice(4).reduce((sum, item) => sum + item.amount, 0);
      finalCategories = [
      ...top4,
      {
        id: 'other',
        amount: otherAmount,
        cat: { name: 'Other', color: '#52525b', icon: 'ellipsis-horizontal' } as any
      }];

    }

    const circumference = 2 * Math.PI * 45;
    let currentOffset = 0;

    const slices = finalCategories.map(({ id, amount, cat }) => {
      const percentage = amount / totalExpense;
      const strokeLength = percentage * circumference;
      const dashOffset = currentOffset;

      currentOffset -= strokeLength;

      return {
        id,
        name: cat?.name || "Unknown",
        color: cat?.color || "#52525b",
        icon: cat?.icon || "ellipse",
        amount,
        percentage: (percentage * 100).toFixed(1),
        strokeDasharray: `${strokeLength} ${circumference}`,
        strokeDashoffset: dashOffset
      };
    });

    return { totalExpense, slices };
  }, [transactions, categories]);

  const { formatCurrency } = useCurrency();

  if (chartData.totalExpense === 0) {
    return (
      <View className="bg-[#0f1011] rounded-2xl p-4 mb-6 border border-[#1b1b1c] items-center justify-center h-48">
        <Text className="text-gray-400">No expenses in this period.</Text>
      </View>);

  }

  return (
    <View className="bg-[#0f1011] rounded-2xl p-4 mb-6 border border-[#1b1b1c]">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-base font-bold">Spending by Category</Text>
        <View className="flex-row items-center">
            <Text className="text-gray-400 text-xs mr-1">{dateLabel}</Text>
        </View>
      </View>

      <View className="flex-row items-center">
        {}
        <View className="w-[140px] h-[140px] relative justify-center items-center">
          <Svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: [{ rotate: '-90deg' }] }}>
            {chartData.slices.map((slice, index) =>
            <Circle
              key={slice.id}
              cx="60"
              cy="60"
              r="45"
              stroke={slice.color}
              strokeWidth="16"
              fill="none"
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset} />

            )}
          </Svg>
          <View className="absolute items-center justify-center">
            <Text className="text-white font-bold text-base mb-0.5">{formatCurrency(chartData.totalExpense)}</Text>
            <Text className="text-gray-400 text-[10px]">Total Expense</Text>
          </View>
        </View>

        {}
        <View className="flex-1 ml-4">
          {chartData.slices.map((slice) =>
          <View key={slice.id} className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <View
                className="w-5 h-5 rounded-full items-center justify-center mr-2"
                style={{ backgroundColor: slice.color }}>
                
                  <Ionicons name={slice.icon as any} size={12} color="white" />
                </View>
                <Text className="text-gray-300 text-xs truncate w-[88px]" numberOfLines={1}>{slice.name}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-white text-xs mr-2">{formatCurrency(slice.amount)}</Text>
                <Text className="text-gray-500 text-[10px] w-8 text-right">{slice.percentage}%</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>);

};

const enhance = withObservables(['startDate', 'endDate'], ({ database, startDate, endDate }: {database: Database;startDate: number;endDate: number;}) => ({
  transactions: database.collections.get<Transaction>('transactions').query(
    Q.where('date', Q.between(startDate, endDate))
  ).observe(),
  categories: database.collections.get<Category>('categories').query().observe()
}));

export const CategorySpendingChart = withDatabase(enhance(CategorySpendingChartComponent));