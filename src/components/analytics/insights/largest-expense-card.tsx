import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Transaction from '../../../server/db/models/Transaction';
import Category from '../../../server/db/models/Category';
import { useCurrency } from '../../../hooks/useCurrency';
import { format } from 'date-fns';

interface LargestExpenseCardProps {
  currentMonthTxns: Transaction[];
  categories: Category[];
}

export function LargestExpenseCard({ currentMonthTxns, categories }: LargestExpenseCardProps) {
  const { formatCurrency } = useCurrency();
  const insight = useMemo(() => {
    const expenses = currentMonthTxns.filter((t) => t.type === 'debit');
    if (expenses.length === 0) return null;

    let maxExpense = expenses[0];
    for (let i = 1; i < expenses.length; i++) {
      if (expenses[i].amount > maxExpense.amount) {
        maxExpense = expenses[i];
      }
    }

    const catId = (maxExpense as any)._raw.category_id;
    const category = categories.find((c) => c.id === catId);

    return {
      amount: maxExpense.amount,
      date: new Date(maxExpense.date),
      categoryName: category?.name || 'Unknown',
      description: maxExpense.description
    };
  }, [currentMonthTxns, categories]);

  if (!insight) {
    return (
      <View className="mx-6 mb-4 rounded-2xl bg-surface-base border border-card-base p-5">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-card-base items-center justify-center mr-3">
            <Ionicons name="bag-handle-outline" size={18} color="#71717a" />
          </View>
          <Text className="text-red-500 text-2xs font-bold tracking-wider uppercase">Largest Expense</Text>
        </View>
        <Text className="text-gray-500 text-sm italic">You don't have any expenses this month.</Text>
      </View>);

  }

  return (
    <View className="mx-6 mb-4 rounded-2xl bg-surface-base border border-card-base p-5">
      <View className="flex-row justify-between mb-2">
        <View className="flex-row items-center flex-1 pr-4">
          <View className="w-12 h-12 rounded-full bg-card-base items-center justify-center mr-4">
            <Ionicons name="bag-handle-outline" size={20} color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text className="text-red-500 text-2xs font-bold tracking-wider uppercase mb-1">Largest Expense</Text>
            <Text className="text-white font-medium text-15px leading-tight">
              Your largest expense this month was <Text className="text-red-500 font-bold">{insight.description || insight.categoryName}</Text>.
            </Text>
          </View>
        </View>
        
        <View className="items-end justify-center">
          <Text className="text-red-500 text-lg font-bold">{formatCurrency(insight.amount)}</Text>
          <View className="bg-card-base rounded-md px-2 py-1 mt-1">
             <Text className="text-gray-400 text-2xs">{insight.categoryName}</Text>
          </View>
        </View>
      </View>

      <View className="mt-2 ml-16">
        <Text className="text-gray-400 text-xs">
          You spent {formatCurrency(insight.amount)} on {format(insight.date, 'd MMM yyyy')}.
        </Text>
      </View>
    </View>);

}