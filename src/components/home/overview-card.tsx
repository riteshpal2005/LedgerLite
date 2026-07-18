import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
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
  const income = filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const expense = filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = income - expense;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View>
      <View className="flex-row justify-between items-end mb-3 z-10 relative">
        <Text className="text-white text-lg font-bold">Overview</Text>
        <TouchableOpacity className="flex-row items-center" onPress={() => setIsTrayOpen(true)}>
          <Text className="text-gray-300 text-sm mr-1">{timeframe}</Text>
          <Ionicons name="chevron-down" size={16} color="#d1d5db" />
        </TouchableOpacity>
      </View>

      {/* Timeframe Tray Modal */}
      <Modal visible={isTrayOpen} transparent animationType="fade">
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center" 
          onPress={() => setIsTrayOpen(false)}
        >
          <View className="bg-[#131415] w-64 rounded-2xl border border-[#27272a] overflow-hidden">
            {(["This Month", "This Week", "Today"] as const).map((item, index) => (
              <TouchableOpacity
                key={item}
                className={`px-4 py-4 ${index !== 2 ? 'border-b border-[#1b1b1c]' : ''} ${timeframe === item ? 'bg-[#3b82f6]/10' : ''}`}
                onPress={() => { setTimeframe(item); setIsTrayOpen(false); }}
              >
                <Text className={`text-center ${timeframe === item ? 'text-[#3b82f6] font-bold' : 'text-gray-300'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

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

const enhance = withObservables(['database'], ({ database }: { database: Database }) => ({
  transactions: database.collections.get<Transaction>('transactions').query().observe(),
}));

export const OverviewCard = withDatabase(enhance(OverviewCardComponent));
