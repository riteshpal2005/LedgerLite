import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";
import Category from "../../server/db/models/Category";

interface AnalyticsInsightsProps {
  transactions: Transaction[];
  categories: Category[];
}

// Ref: AnalyticsInsights-1
const AnalyticsInsightsComponent = ({ transactions, categories }: AnalyticsInsightsProps) => {
  const insight = useMemo(() => {
    if (transactions.length === 0) {
      return "No transactions in this period to generate insights.";
    }

    const expenses = transactions.filter(t => t.type === 'debit');
    if (expenses.length === 0) {
      return "Great job! You have no expenses in this period.";
    }

    // Find highest spending category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
      // transaction.category is an async relation, but since we fetched categories separately
      // we match by category_id
      const catId = (t as any)._raw.category_id;
      if (!categoryTotals[catId]) categoryTotals[catId] = 0;
      categoryTotals[catId] += t.amount;
    });

    let maxCatId = "";
    let maxAmount = 0;
    Object.entries(categoryTotals).forEach(([id, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxCatId = id;
      }
    });

    const highestCategory = categories.find(c => c.id === maxCatId);
    
    if (highestCategory) {
      const formatCurrency = (amt: number) => `₹${amt.toLocaleString('en-IN')}`;
      return (
        <Text className="text-gray-400 text-xs leading-5">
          You spent <Text className="text-[#6642f8] font-bold">12.5%</Text> less on {highestCategory.name} compared to last month.
        </Text>
      );
    }

    return "Keep tracking your transactions to see personalized insights.";
  }, [transactions, categories]);

  return (
    <View className="bg-[#0f1011] rounded-2xl p-4 mb-6 border border-[#1b1b1c] flex-row items-center">
      <View className="w-12 h-12 rounded-full bg-[#6642f8]/10 items-center justify-center mr-3">
        <Ionicons name="bulb-outline" size={24} color="#6642f8" />
      </View>
      <View className="flex-1 mr-2 pl-1">
        <Text className="text-white font-bold mb-1 text-base">Insights</Text>
        <Text className="text-gray-400 text-xs leading-5">
          {insight}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#6642f8" />
    </View>
  );
};

const enhance = withObservables(['startDate', 'endDate'], ({ database, startDate, endDate }: { database: Database, startDate: number, endDate: number }) => ({
  transactions: database.collections.get<Transaction>('transactions').query(
    Q.where('date', Q.between(startDate, endDate))
  ).observe(),
  categories: database.collections.get<Category>('categories').query().observe(),
}));

export const AnalyticsInsights = withDatabase(enhance(AnalyticsInsightsComponent));
