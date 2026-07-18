import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";
import Account from "../../server/db/models/Account";
import { Q } from "@nozbe/watermelondb";

interface OverviewCardProps {
  transactions: Transaction[];
  accounts: Account[];
}

// Ref: OverviewCard-1
const OverviewCardComponent = ({ transactions, accounts }: OverviewCardProps) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [timeframe, setTimeframe] = useState<"This Month" | "This Week" | "Today">("This Month");
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Calculate start of week (assuming Monday is start of week)
    const day = now.getDay() || 7; // Get current day number, converting Sun(0) to 7
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1).getTime();
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return transactions.filter((t) => {
      if (timeframe === "Today") return t.date >= startOfToday;
      if (timeframe === "This Week") return t.date >= startOfWeek;
      return t.date >= startOfMonth; // Default "This Month"
    });
  }, [transactions, timeframe]);

  // Dynamic calculations based on observable transaction stream
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, account) => acc + (account.currentBalance ?? account.balance), 0);
  }, [accounts]);

  const income = filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const expense = filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View className="z-50">
      <View className="flex-row justify-between items-end mb-3 z-50 relative">
        <Text className="text-white text-lg font-bold">Overview</Text>
        <TouchableOpacity className="flex-row items-center" onPress={() => setIsTrayOpen(!isTrayOpen)}>
          <Text className="text-gray-300 text-sm mr-1">{timeframe}</Text>
          <Ionicons name={isTrayOpen ? "chevron-up" : "chevron-down"} size={16} color="#d1d5db" />
        </TouchableOpacity>

        {/* Timeframe Dropdown */}
        {isTrayOpen && (
          <View className="absolute top-full right-0 mt-2 bg-[#18181b] w-40 rounded-2xl border border-[#27272a] overflow-hidden shadow-2xl z-50">
            {(["This Month", "This Week", "Today"] as const).map((item, index) => (
              <TouchableOpacity
                key={item}
                className={`px-4 py-3 ${index !== 2 ? 'border-b border-[#27272a]' : ''} ${timeframe === item ? 'bg-[#3b82f6]/10' : ''}`}
                onPress={() => { setTimeframe(item); setIsTrayOpen(false); }}
              >
                <Text className={`text-sm ${timeframe === item ? 'text-[#3b82f6] font-bold' : 'text-gray-300'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
          <View className="flex-1 flex-row justify-between items-center">
            <View>
              <Text className="text-green-500 text-xs mb-1">Income</Text>
              <Text className="text-green-500 text-lg font-bold">
                {isBalanceVisible ? formatCurrency(income) : "••••••••"}
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-[#112417] items-center justify-center mr-2">
              <Ionicons name="trending-up" size={18} color="#22c55e" />
            </View>
          </View>
          <View className="w-px h-12 bg-[#1b1b1c] mx-2" />
          <View className="flex-1 flex-row justify-between items-center pl-2">
            <View>
              <Text className="text-red-500 text-xs mb-1">Expense</Text>
              <Text className="text-red-500 text-lg font-bold">
                {isBalanceVisible ? formatCurrency(expense) : "••••••••"}
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-[#271416] items-center justify-center">
              <Ionicons name="trending-down" size={18} color="#ef4444" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export const OverviewCard = withDatabase(
  withObservables([], ({ database }: any) => ({
    transactions: database.collections.get('transactions').query(
      Q.where('sync_status', Q.notEq('deleted'))
    ).observe(),
    accounts: database.collections.get('accounts').query(
      Q.where('sync_status', Q.notEq('deleted'))
    ).observe(),
  }))(OverviewCardComponent)
);
