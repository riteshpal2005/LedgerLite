import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { withDatabase } from "@nozbe/watermelondb/react";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import Transaction from "../../server/db/models/Transaction";
import Category from "../../server/db/models/Category";
import { format } from "date-fns";
import { Q } from "@nozbe/watermelondb";
import { useRouter } from "expo-router";
import { useCurrency } from "../../hooks/useCurrency";

const RecentTransactionRowComponent = ({ tx, category, isLast }: { tx: Transaction, category: Category, isLast: boolean }) => {
  const isIncome = tx.type === "credit";
  const { formatCurrency } = useCurrency();
  return (
    <>
      <View className="flex-row justify-between items-center p-3">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${category.color}30` }}
          >
            <Ionicons name={category.icon as any} size={20} color={category.color} />
          </View>
          <View className="flex-1 mr-2">
            <Text className="text-white text-base font-bold" numberOfLines={1}>{tx.description || category.name}</Text>
            <Text className="text-gray-400 text-xs mt-1">
              {format(new Date(tx.date), "MMM d, yyyy")} • <Text className={isIncome ? 'text-green-500' : 'text-red-500'}>{isIncome ? "Income" : "Expense"}</Text>
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <Text className={`${isIncome ? 'text-green-500' : 'text-red-500'} text-base font-bold mr-2`}>
            {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#6b7280" />
        </View>
      </View>
      {!isLast && <View className="h-px bg-[#1b1b1c] mx-3" />}
    </>
  );
};

const RecentTransactionRow = withObservables(['tx'], ({ tx }: { tx: Transaction }) => ({
  tx,
  category: tx.category,
}))(RecentTransactionRowComponent);

// Ref: RecentTransactions-1
function RecentTransactionsComponent({ transactions }: { transactions: Transaction[] }) {
  const router = useRouter();
  
  if (!transactions || transactions.length === 0) {
    return (
      <View>
        <Text className="text-white text-lg font-bold mb-3">Recent Transactions</Text>
        <View className="bg-[#0f1011] rounded-2xl p-6 items-center justify-center mb-8">
          <Text className="text-gray-400">No recent transactions.</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row justify-between items-end mb-3">
        <Text className="text-white text-lg font-bold">Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/transactions")}>
          <Text className="text-[#6642f8] text-sm font-bold">See all</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-[#0f1011] rounded-2xl p-2 mb-8">
        {transactions.map((tx, index) => (
          <RecentTransactionRow 
            key={tx.id} 
            tx={tx} 
            isLast={index === transactions.length - 1} 
          />
        ))}
      </View>
    </View>
  );
}

export const RecentTransactions = withDatabase(
  withObservables([], ({ database }: any) => ({
    transactions: database.collections.get('transactions').query(
      Q.where('sync_status', Q.notEq('deleted')),
      Q.sortBy('date', Q.desc),
      Q.take(4)
    ).observe(),
  }))(RecentTransactionsComponent)
);
