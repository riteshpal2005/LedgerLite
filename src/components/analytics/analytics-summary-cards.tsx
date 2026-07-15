import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";

interface AnalyticsSummaryCardsProps {
  transactions: Transaction[];
}

// Ref: AnalyticsSummaryCards-1
const AnalyticsSummaryCardsComponent = ({ transactions }: AnalyticsSummaryCardsProps) => {
  const { income, expense, netBalance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(t => {
      if (t.type === 'credit') inc += t.amount;
      else if (t.type === 'debit') exp += t.amount;
    });
    return { income: inc, expense: exp, netBalance: inc - exp };
  }, [transactions]);

  const formatCurrency = (amount: number) => `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View className="flex-row justify-between mb-6">
      {/* Total Income */}
      <View className="bg-[#0f1011] p-3 rounded-2xl flex-1 mr-2 border border-[#1b1b1c]">
        <View className="w-8 h-8 bg-[#12281a] rounded-full items-center justify-center mb-2">
          <Ionicons name="arrow-down-outline" size={16} color="#22c55e" />
        </View>
        <Text className="text-gray-400 text-xs mb-1">Total Income</Text>
        <Text className="text-green-500 text-base font-bold mb-1">{formatCurrency(income)}</Text>
        {/* Placeholder for trending % - needs historical data comparison */}
        <View className="flex-row items-center">
          <Ionicons name="remove-outline" size={10} color="#6b7280" />
          <Text className="text-gray-500 text-[9px] ml-1">in selected range</Text>
        </View>
      </View>

      {/* Total Expense */}
      <View className="bg-[#0f1011] p-3 rounded-2xl flex-1 mr-2 border border-[#1b1b1c]">
        <View className="w-8 h-8 bg-[#2a1313] rounded-full items-center justify-center mb-2">
          <Ionicons name="arrow-up-outline" size={16} color="#ef4444" />
        </View>
        <Text className="text-gray-400 text-xs mb-1">Total Expense</Text>
        <Text className="text-red-500 text-base font-bold mb-1">{formatCurrency(expense)}</Text>
        <View className="flex-row items-center">
          <Ionicons name="remove-outline" size={10} color="#6b7280" />
          <Text className="text-gray-500 text-[9px] ml-1">in selected range</Text>
        </View>
      </View>

      {/* Net Balance */}
      <View className="bg-[#0f1011] p-3 rounded-2xl flex-1 border border-[#1b1b1c]">
        <View className={`w-8 h-8 rounded-full items-center justify-center mb-2 ${netBalance >= 0 ? 'bg-blue-900/30' : 'bg-red-900/30'}`}>
          <Ionicons name={netBalance >= 0 ? "trending-up-outline" : "trending-down-outline"} size={16} color={netBalance >= 0 ? "#6642f8" : "#ef4444"} />
        </View>
        <Text className="text-gray-400 text-xs mb-1">Net Balance</Text>
        <Text className={`${netBalance >= 0 ? 'text-[#6642f8]' : 'text-red-500'} text-base font-bold mb-1`}>
          {netBalance < 0 ? "-" : ""}{formatCurrency(netBalance)}
        </Text>
        <View className="flex-row items-center">
          <Ionicons name="remove-outline" size={10} color="#6b7280" />
          <Text className="text-gray-500 text-[9px] ml-1">in selected range</Text>
        </View>
      </View>
    </View>
  );
};

// We receive startDate and endDate as props from the parent
const enhance = withObservables(['startDate', 'endDate'], ({ database, startDate, endDate }: { database: Database, startDate: number, endDate: number }) => ({
  transactions: database.collections.get<Transaction>('transactions').query(
    Q.where('date', Q.between(startDate, endDate))
  ).observe(),
}));

export const AnalyticsSummaryCards = withDatabase(enhance(AnalyticsSummaryCardsComponent));
