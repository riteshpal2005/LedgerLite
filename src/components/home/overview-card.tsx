import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import Transaction from "../../server/db/models/Transaction";
import Account from "../../server/db/models/Account";
import { Q } from "@nozbe/watermelondb";
import { useCurrency } from "../../hooks/useCurrency";

interface OverviewCardProps {
  transactions: Transaction[];
  accounts: Account[];
}


const OverviewCardComponent = ({ transactions, accounts }: OverviewCardProps) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [timeframe, setTimeframe] = useState<"This Month" | "This Week" | "Today">("This Month");
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();


    const day = now.getDay() || 7;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1).getTime();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return transactions.filter((t) => {
      if (timeframe === "Today") return t.date >= startOfToday;
      if (timeframe === "This Week") return t.date >= startOfWeek;
      return t.date >= startOfMonth;
    });
  }, [transactions, timeframe]);


  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, account) => acc + (account.currentBalance ?? account.balance), 0);
  }, [accounts]);

  const income = filteredTransactions.filter((t) => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const expense = filteredTransactions.filter((t) => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  const { formatCurrency } = useCurrency();

  return (
    <View className="z-50">
      <View className="flex-row justify-between items-end mb-3 z-50 relative">
        <Text className="text-white text-lg font-bold">Overview</Text>
        <TouchableOpacity className="flex-row items-center" onPress={() => setIsTrayOpen(!isTrayOpen)}>
          <Text className="text-gray-300 text-sm mr-1">{timeframe}</Text>
          <Ionicons name={isTrayOpen ? "chevron-up" : "chevron-down"} size={16} color="#d1d5db" />
        </TouchableOpacity>

        {}
        {isTrayOpen &&
        <View className="absolute top-full right-0 mt-2 bg-zinc-900 w-40 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl z-50">
            {(["This Month", "This Week", "Today"] as const).map((item, index) =>
          <TouchableOpacity
            key={item}
            className={`px-4 py-3 ${index !== 2 ? 'border-b border-zinc-800' : ''} ${timeframe === item ? 'bg-blue-500/10' : ''}`}
            onPress={() => {setTimeframe(item);setIsTrayOpen(false);}}>
            
                <Text className={`text-sm ${timeframe === item ? 'text-blue-500 font-bold' : 'text-gray-300'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
          )}
          </View>
        }
      </View>

      <View className="bg-surface-base rounded-2xl p-5 mb-8">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-400 text-sm">Total Balance</Text>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
            <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={24} color="#d1d5db" />
          </TouchableOpacity>
        </View>
        <Text className="text-white text-4xl font-bold mb-4">
          {isBalanceVisible ? formatCurrency(totalBalance) : "••••••••"}
        </Text>
        
        <View className="h-px bg-card-base w-full mb-4" />
        
        <View className="flex-row justify-between items-center">
          <View className="flex-1 flex-row justify-between items-center">
            <View>
              <Text className="text-green-500 text-xs mb-1">Income</Text>
              <Text className="text-green-500 text-lg font-bold">
                {isBalanceVisible ? formatCurrency(income) : "••••••••"}
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-emerald-highlight-dark items-center justify-center mr-2">
              <Ionicons name="trending-up" size={18} color="#22c55e" />
            </View>
          </View>
          <View className="w-px h-12 bg-card-base mx-2" />
          <View className="flex-1 flex-row justify-between items-center pl-2">
            <View>
              <Text className="text-red-500 text-xs mb-1">Expense</Text>
              <Text className="text-red-500 text-lg font-bold">
                {isBalanceVisible ? formatCurrency(expense) : "••••••••"}
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-red-bg-dark items-center justify-center">
              <Ionicons name="trending-down" size={18} color="#ef4444" />
            </View>
          </View>
        </View>
      </View>
    </View>);

};

export const OverviewCard = withDatabase(
  withObservables([], ({ database }: any) => ({
    transactions: database.collections.get('transactions').query(
      Q.where('sync_status', Q.notEq('deleted'))
    ).observe(),
    accounts: database.collections.get('accounts').query(
      Q.where('sync_status', Q.notEq('deleted'))
    ).observe()
  }))(OverviewCardComponent)
);