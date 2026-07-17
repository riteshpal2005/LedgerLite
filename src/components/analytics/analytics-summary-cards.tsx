import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";

interface AnalyticsSummaryCardsProps {
  transactions: Transaction[];
}

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
      <View className="bg-[#0f1011] p-3 pb-4 rounded-2xl flex-1 mr-2 border border-[#1b1b1c]">
        <View className="w-8 h-8 bg-[#22c55e]/20 rounded-full items-center justify-center mb-3">
          <Ionicons name="arrow-down" size={16} color="#22c55e" />
        </View>
        <Text className="text-gray-400 text-xs mb-1">Total Income</Text>
        <Text className="text-green-500 text-sm font-bold mb-2">{formatCurrency(income)}</Text>
        <View className="flex-row items-center mb-4">
          <Ionicons name="caret-up" size={10} color="#22c55e" />
          <Text className="text-green-500 text-[10px] font-bold mx-1">12.5%</Text>
          <Text className="text-gray-500 text-[9px]">vs last month</Text>
        </View>
        <View className="h-6 w-full">
            <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                <Path d="M0 15 L20 18 L40 10 L60 12 L80 5 L100 0" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity={0.6}/>
            </Svg>
        </View>
      </View>

      {/* Total Expense */}
      <View className="bg-[#0f1011] p-3 pb-4 rounded-2xl flex-1 mr-2 border border-[#1b1b1c]">
        <View className="w-8 h-8 bg-[#ef4444]/20 rounded-full items-center justify-center mb-3">
          <Ionicons name="arrow-up" size={16} color="#ef4444" />
        </View>
        <Text className="text-gray-400 text-xs mb-1">Total Expense</Text>
        <Text className="text-red-500 text-sm font-bold mb-2">{formatCurrency(expense)}</Text>
        <View className="flex-row items-center mb-4">
          <Ionicons name="caret-up" size={10} color="#ef4444" />
          <Text className="text-red-500 text-[10px] font-bold mx-1">8.3%</Text>
          <Text className="text-gray-500 text-[9px]">vs last month</Text>
        </View>
        <View className="h-6 w-full">
            <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                <Path d="M0 18 L20 18 L40 16 L60 14 L80 10 L100 5" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity={0.6}/>
            </Svg>
        </View>
      </View>

      {/* Net Balance */}
      <View className="bg-[#0f1011] p-3 pb-4 rounded-2xl flex-1 border border-[#1b1b1c]">
        <View className="w-8 h-8 bg-[#6642f8]/20 rounded-full items-center justify-center mb-3">
          <Ionicons name="analytics" size={16} color="#6642f8" />
        </View>
        <Text className="text-gray-400 text-xs mb-1">Net Balance</Text>
        <Text className={`${netBalance >= 0 ? 'text-[#6642f8]' : 'text-[#6642f8]'} text-sm font-bold mb-2`}>
          {netBalance < 0 ? "-" : ""}{formatCurrency(netBalance)}
        </Text>
        <View className="flex-row items-center mb-4">
          <Ionicons name="caret-up" size={10} color="#6642f8" />
          <Text className="text-[#6642f8] text-[10px] font-bold mx-1">15.2%</Text>
          <Text className="text-gray-500 text-[9px]">vs last month</Text>
        </View>
        <View className="h-6 w-full">
            <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                <Path d="M0 16 L20 15 L40 17 L60 14 L80 8 L100 5" stroke="#6642f8" strokeWidth="1.5" fill="none" opacity={0.6}/>
            </Svg>
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
