import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";
import Account from "../../server/db/models/Account";

interface AnalyticsSummaryCardsProps {
  transactions: Transaction[];
  prevTransactions: Transaction[];
  accounts: Account[];
  prevDateLabel?: string;
}

const AnalyticsSummaryCardsComponent = ({ transactions, prevTransactions, accounts, prevDateLabel = "vs previous period" }: AnalyticsSummaryCardsProps) => {
  const { income, expense, netBalance, incomeChange, expenseChange, netChange } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(t => {
      if (t.type === 'credit') inc += t.amount;
      else if (t.type === 'debit') exp += t.amount;
    });
    
    const currentTotalBalance = accounts.reduce((acc, a) => acc + (a.currentBalance ?? a.balance), 0);
    const net = currentTotalBalance - exp;

    let pInc = 0;
    let pExp = 0;
    prevTransactions.forEach(t => {
      if (t.type === 'credit') pInc += t.amount;
      else if (t.type === 'debit') pExp += t.amount;
    });

    const calcChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : (curr < 0 ? -100 : 0);
      return ((curr - prev) / prev) * 100;
    };

    // To properly calculate the previous net balance from accounts we'd need historical snapshots,
    // which we don't have. So we approximate the "net change" by looking at the change in net cash flow
    // (Income - Expense) instead for the comparative period.
    const currCashFlow = inc - exp;
    const prevCashFlow = pInc - pExp;

    return { 
      income: inc, 
      expense: exp, 
      netBalance: net,
      incomeChange: calcChange(inc, pInc),
      expenseChange: calcChange(exp, pExp),
      netChange: calcChange(currCashFlow, prevCashFlow)
    };
  }, [transactions, prevTransactions, accounts]);

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
        <View className="mb-3 min-h-[28px] justify-center">
          <View className="flex-row items-center mb-0.5">
            <Ionicons name={incomeChange >= 0 ? "caret-up" : "caret-down"} size={10} color={incomeChange >= 0 ? "#22c55e" : "#ef4444"} />
            <Text className={`${incomeChange >= 0 ? 'text-green-500' : 'text-red-500'} text-[10px] font-bold mx-1`}>
              {Math.abs(incomeChange).toFixed(1)}%
            </Text>
          </View>
          <Text className="text-gray-500 text-[8px]" numberOfLines={1}>{prevDateLabel}</Text>
        </View>
        <View className="h-6 w-full">
            <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                <Path d="M0 15 C 10 15, 10 18, 20 18 C 30 18, 30 10, 40 10 C 50 10, 50 12, 60 12 C 70 12, 70 5, 80 5 C 90 5, 90 0, 100 0" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity={0.6}/>
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
        <View className="mb-3 min-h-[28px] justify-center">
          <View className="flex-row items-center mb-0.5">
            <Ionicons name={expenseChange >= 0 ? "caret-up" : "caret-down"} size={10} color={expenseChange >= 0 ? "#ef4444" : "#22c55e"} />
            <Text className={`${expenseChange >= 0 ? 'text-red-500' : 'text-green-500'} text-[10px] font-bold mx-1`}>
              {Math.abs(expenseChange).toFixed(1)}%
            </Text>
          </View>
          <Text className="text-gray-500 text-[8px]" numberOfLines={1}>{prevDateLabel}</Text>
        </View>
        <View className="h-6 w-full">
            <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                <Path d="M0 18 C 10 18, 10 18, 20 18 C 30 18, 30 16, 40 16 C 50 16, 50 14, 60 14 C 70 14, 70 10, 80 10 C 90 10, 90 5, 100 5" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity={0.6}/>
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
        <View className="mb-3 min-h-[28px] justify-center">
          <View className="flex-row items-center mb-0.5">
            <Ionicons name={netChange >= 0 ? "caret-up" : "caret-down"} size={10} color={netChange >= 0 ? "#6642f8" : "#ef4444"} />
            <Text className={`${netChange >= 0 ? 'text-[#6642f8]' : 'text-red-500'} text-[10px] font-bold mx-1`}>
              {Math.abs(netChange).toFixed(1)}%
            </Text>
          </View>
          <Text className="text-gray-500 text-[8px]" numberOfLines={1}>{prevDateLabel}</Text>
        </View>
        <View className="h-6 w-full">
            <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                <Path d="M0 16 C 10 16, 10 15, 20 15 C 30 15, 30 17, 40 17 C 50 17, 50 14, 60 14 C 70 14, 70 8, 80 8 C 90 8, 90 5, 100 5" stroke="#6642f8" strokeWidth="1.5" fill="none" opacity={0.6}/>
            </Svg>
        </View>
      </View>
    </View>
  );
};

// We receive startDate and endDate as props from the parent
const enhance = withObservables(['startDate', 'endDate', 'prevStartDate', 'prevEndDate'], ({ database, startDate, endDate, prevStartDate, prevEndDate }: { database: any, startDate: number, endDate: number, prevStartDate: number, prevEndDate: number }) => ({
  transactions: database.collections.get('transactions').query(
    Q.where('date', Q.between(startDate, endDate))
  ).observe(),
  prevTransactions: database.collections.get('transactions').query(
    Q.where('date', Q.between(prevStartDate, prevEndDate))
  ).observe(),
  accounts: database.collections.get('accounts').query().observe(),
}));

export const AnalyticsSummaryCards = withDatabase(enhance(AnalyticsSummaryCardsComponent as any));
