import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Transaction from "../../server/db/models/Transaction";
import { useCurrency } from "../../hooks/useCurrency";

interface GroupSummaryCardProps {
  transactions: Transaction[];
}


export function GroupSummaryCard({ transactions }: GroupSummaryCardProps) {
  const income = transactions.filter((t) => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = income - expense;

  const { formatCurrency } = useCurrency();

  return (
    <View className="bg-surface-base rounded-2xl p-4 flex-row justify-between mb-8 border border-card-base">
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-emerald-highlight-darker rounded-full items-center justify-center mr-2">
          <Ionicons name="arrow-down-outline" size={18} color="#22c55e" />
        </View>
        <View>
          <Text className="text-gray-400 text-2xs mb-0.5">Total Income</Text>
          <Text className="text-green-500 text-xs font-bold">{formatCurrency(income)}</Text>
        </View>
      </View>

      <View className="w-px h-full bg-card-base" />

      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-red-surface-dark rounded-full items-center justify-center mr-2">
          <Ionicons name="arrow-up-outline" size={18} color="#ef4444" />
        </View>
        <View>
          <Text className="text-gray-400 text-2xs mb-0.5">Total Expense</Text>
          <Text className="text-red-500 text-xs font-bold">{formatCurrency(expense)}</Text>
        </View>
      </View>

      <View className="w-px h-full bg-card-base" />

      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${totalBalance >= 0 ? 'bg-blue-900/30' : 'bg-red-900/30'}`}>
          <Ionicons name={totalBalance >= 0 ? "trending-up-outline" : "trending-down-outline"} size={18} color={totalBalance >= 0 ? "#6642f8" : "#ef4444"} />
        </View>
        <View>
          <Text className="text-gray-400 text-2xs mb-0.5">Net Balance</Text>
          <Text className={`${totalBalance >= 0 ? 'text-brand-primary' : 'text-red-500'} text-xs font-bold`}>
            {formatCurrency(totalBalance)}
          </Text>
        </View>
      </View>
    </View>);

}