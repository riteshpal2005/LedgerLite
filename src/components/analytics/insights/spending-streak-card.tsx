import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Transaction from '../../../server/db/models/Transaction';
import { getDaysInMonth } from 'date-fns';

interface SpendingStreakCardProps {
  currentMonthTxns: Transaction[];
  currentDate: Date;
}

export function SpendingStreakCard({ currentMonthTxns, currentDate }: SpendingStreakCardProps) {
  const insight = useMemo(() => {
    const expenses = currentMonthTxns.filter((t) => t.type === 'debit');


    if (expenses.length < 3) return null;

    let totalExpense = 0;
    const expenseByDay: Record<number, number> = {};

    expenses.forEach((t) => {
      totalExpense += t.amount;
      const day = new Date(t.date).getDate();
      expenseByDay[day] = (expenseByDay[day] || 0) + t.amount;
    });

    const daysInMonth = getDaysInMonth(currentDate);

    const currentDayOfMonth = currentDate.getMonth() === new Date().getMonth() ? new Date().getDate() : daysInMonth;
    const averageDailySpend = totalExpense / currentDayOfMonth;

    let underBudgetDays = 0;

    for (let i = 1; i <= currentDayOfMonth; i++) {
      const spendToday = expenseByDay[i] || 0;

      if (spendToday < averageDailySpend * 0.8) {
        underBudgetDays++;
      }
    }

    if (underBudgetDays === 0) return null;

    return {
      underBudgetDays
    };
  }, [currentMonthTxns, currentDate]);

  if (!insight) {
    return (
      <View className="mx-6 mb-4 rounded-2xl bg-[#0f1011] border border-[#1b1b1c] p-5">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-[#1b1b1c] items-center justify-center mr-3">
            <Ionicons name="trophy-outline" size={18} color="#71717a" />
          </View>
          <Text className="text-[#3b82f6] text-[10px] font-bold tracking-wider uppercase">Spending Streak</Text>
        </View>
        <Text className="text-gray-500 text-sm italic">Track your expenses regularly to unlock spending streak insights.</Text>
      </View>);

  }

  return (
    <View className="mx-6 mb-8 rounded-2xl bg-[#0f1011] border border-[#1b1b1c] p-5">
      <View className="flex-row justify-between items-center">
        <View className="flex-row flex-1 pr-4">
          <View className="w-12 h-12 rounded-full bg-[#1b1b1c] items-center justify-center mr-4">
            <Ionicons name="trophy-outline" size={20} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-[#3b82f6] text-[10px] font-bold tracking-wider uppercase mb-1">Spending Streak</Text>
            <Text className="text-white font-medium text-[15px] leading-tight mb-2">
              Great! You stayed under budget for <Text className="text-[#3b82f6] font-bold">{insight.underBudgetDays} days</Text> this month.
            </Text>
            <Text className="text-gray-400 text-xs">Keep it up! Consistency is the key.</Text>
          </View>
        </View>
        
        <View className="items-center justify-center relative w-20 h-20">
           {}
           <View className="absolute inset-0 bg-[#3b82f6]/10 rounded-full" style={{ transform: [{ scale: 1.2 }] }} />
           <View className="absolute inset-2 bg-[#3b82f6]/20 rounded-full" />
           <View className="w-14 h-14 bg-[#1b1b1c] rounded-full items-center justify-center border-2 border-[#3b82f6]">
             <Text className="text-white text-xl font-bold">{insight.underBudgetDays}</Text>
             <Text className="text-gray-400 text-[8px] -mt-1 uppercase">Days</Text>
           </View>
           
           {}
           <View className="absolute top-0 right-2 w-1.5 h-1.5 bg-[#10b981] rotate-45" />
           <View className="absolute bottom-1 right-0 w-1 h-2 bg-[#a855f7] rotate-12" />
           <View className="absolute top-4 -left-1 w-2 h-1 bg-[#ef4444] -rotate-12" />
           <View className="absolute bottom-3 left-1 w-1.5 h-1.5 bg-[#f59e0b] rotate-45" />
        </View>
      </View>
    </View>);

}