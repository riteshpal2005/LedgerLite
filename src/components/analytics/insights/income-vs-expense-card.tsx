import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Transaction from '../../../server/db/models/Transaction';
import { useCurrency } from '../../../hooks/useCurrency';
import Svg, { Circle } from 'react-native-svg';

interface IncomeVsExpenseCardProps {
  currentMonthTxns: Transaction[];
}

export function IncomeVsExpenseCard({ currentMonthTxns }: IncomeVsExpenseCardProps) {
  const { formatCurrency } = useCurrency();
  const insight = useMemo(() => {
    let income = 0;
    let expense = 0;

    currentMonthTxns.forEach((t) => {
      if (t.type === 'credit') income += t.amount;
      if (t.type === 'debit') expense += t.amount;
    });


    if (income === 0 || expense === 0) return null;

    const saved = income - expense;

    const percentage = Math.round(saved / income * 100);

    return {
      income,
      expense,
      saved,
      percentage
    };
  }, [currentMonthTxns]);

  if (!insight) {
    return (
      <View className="mx-6 mb-4 rounded-2xl bg-surface-base border border-card-base p-5">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-card-base items-center justify-center mr-3">
            <Ionicons name="trending-up" size={18} color="#71717a" />
          </View>
          <Text className="text-emerald-500 text-2xs font-bold tracking-wider uppercase">Income vs Expense</Text>
        </View>
        <Text className="text-gray-500 text-sm italic">Add both income and expenses to see your savings rate.</Text>
      </View>);

  }

  const isPositive = insight.percentage >= 0;
  const color = isPositive ? '#10b981' : '#ef4444';
  const label = isPositive ? 'saved' : 'overspent';


  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;


  const clampedPercent = Math.min(Math.max(Math.abs(insight.percentage), 0), 100);
  const strokeDashoffset = circumference - clampedPercent / 100 * circumference;

  return (
    <View className="mx-6 mb-4 rounded-2xl bg-surface-base border border-card-base p-5">
      <View className="flex-row justify-between mb-2">
        <View className="flex-row flex-1 pr-4">
          <View className="w-12 h-12 rounded-full bg-card-base items-center justify-center mr-4">
            <Ionicons name={isPositive ? "trending-up" : "trending-down"} size={20} color={color} />
          </View>
          <View className="flex-1">
            <Text style={{ color }} className="text-2xs font-bold tracking-wider uppercase mb-1">Income vs Expense</Text>
            <Text className="text-white font-medium text-15px leading-tight">
              You've {label} <Text style={{ color }} className="font-bold">{Math.abs(insight.percentage)}%</Text> of your income this month.
            </Text>
          </View>
        </View>
        
        <View className="items-center justify-center relative">
          <Svg width={size} height={size} className="-rotate-90">
            {}
            <Circle
              stroke="#27272a"
              fill="none"
              cx={size / 2} cy={size / 2} r={radius}
              strokeWidth={strokeWidth} />
            
            {}
            <Circle
              stroke={color}
              fill="none"
              cx={size / 2} cy={size / 2} r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" />
            
          </Svg>
          <View className="absolute items-center justify-center">
             <Text className="text-white font-bold text-xs">{Math.abs(insight.percentage)}%</Text>
          </View>
          <Text className="text-gray-500 text-3xs mt-1 text-center w-full">Savings Rate</Text>
        </View>
      </View>

      <View className="mt-2 ml-16 pr-12">
        <Text className="text-gray-400 text-xs leading-relaxed">
          Your income was {formatCurrency(insight.income)} and expenses were {formatCurrency(insight.expense)}.
        </Text>
      </View>
    </View>);

}