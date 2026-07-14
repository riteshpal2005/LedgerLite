import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";

interface OverviewCardProps {
  transactions: Transaction[];
}

// Ref: OverviewCard-1
const OverviewCardComponent = ({ transactions }: OverviewCardProps) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  // Dynamic calculations based on observable transaction stream
  const income = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = income - expense;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View>
      <View className="flex-row justify-between items-end mb-3">
        <Text className="text-white text-lg font-bold">Overview</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-gray-300 text-sm mr-1">This Month</Text>
          <Ionicons name="chevron-down" size={16} color="#d1d5db" />
        </TouchableOpacity>
      </View>

      <View className="bg-[#0f1011] rounded-2xl p-5 mb-8">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-400 text-sm">Total Balance</Text>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
            <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={24} color="#d1d5db" />
          </TouchableOpacity>
        </View>
        <Text className="text-white text-4xl font-bold mb-4">
          {isBalanceVisible ? formatCurrency(totalBalance) : "••••••••"}
        </Text>
        
        <View className="h-px bg-[#1b1b1c] w-full mb-4" />
        
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-green-500 text-sm mb-1">Income</Text>
            <Text className="text-green-500 text-lg font-bold">
              {isBalanceVisible ? formatCurrency(income) : "••••••••"}
            </Text>
          </View>
          <View className="w-px h-10 bg-[#1b1b1c] mx-4" />
          <View className="flex-1">
            <Text className="text-red-500 text-sm mb-1">Expense</Text>
            <Text className="text-white text-lg font-bold">
              {isBalanceVisible ? formatCurrency(expense) : "••••••••"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const enhance = withObservables(['database'], ({ database }: { database: Database }) => ({
  transactions: database.collections.get<Transaction>('transactions').query().observe(),
}));

export const OverviewCard = withDatabase(enhance(OverviewCardComponent));
