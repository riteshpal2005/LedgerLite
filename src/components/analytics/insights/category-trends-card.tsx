import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Transaction from '../../../server/db/models/Transaction';
import Category from '../../../server/db/models/Category';
import { useCurrency } from '../../../hooks/useCurrency';

interface CategoryTrendsCardProps {
  currentMonthTxns: Transaction[];
  lastMonthTxns: Transaction[];
  categories: Category[];
}

export function CategoryTrendsCard({ currentMonthTxns, lastMonthTxns, categories }: CategoryTrendsCardProps) {
  const { formatCurrency } = useCurrency();
  const insight = useMemo(() => {
    const currentExpenses = currentMonthTxns.filter((t) => t.type === 'debit');
    const lastExpenses = lastMonthTxns.filter((t) => t.type === 'debit');

    if (currentExpenses.length === 0 || lastExpenses.length === 0) {
      return null;
    }

    const currentTotals: Record<string, number> = {};
    const lastTotals: Record<string, number> = {};

    currentExpenses.forEach((t) => {
      const catId = (t as any)._raw.category_id;
      currentTotals[catId] = (currentTotals[catId] || 0) + t.amount;
    });

    lastExpenses.forEach((t) => {
      const catId = (t as any)._raw.category_id;
      lastTotals[catId] = (lastTotals[catId] || 0) + t.amount;
    });


    let maxCatId = "";
    let maxAmount = 0;

    Object.entries(currentTotals).forEach(([catId, amount]) => {
      if (lastTotals[catId] && amount > maxAmount) {
        maxAmount = amount;
        maxCatId = catId;
      }
    });

    if (!maxCatId) return null;

    const category = categories.find((c) => c.id === maxCatId);
    if (!category) return null;

    const currentTotal = maxAmount;
    const lastTotal = lastTotals[maxCatId];
    const diff = currentTotal - lastTotal;
    const percentChange = Math.abs(Math.round(diff / lastTotal * 100));
    const isLess = diff < 0;

    return {
      categoryName: category.name,
      percentChange,
      isLess,
      currentTotal,
      lastTotal
    };
  }, [currentMonthTxns, lastMonthTxns, categories]);

  if (!insight) {
    return (
      <View className="mx-6 mb-4 rounded-2xl bg-surface-base border border-card-base p-5">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-card-base items-center justify-center mr-3">
            <Ionicons name="restaurant-outline" size={18} color="#71717a" />
          </View>
          <Text className="text-emerald-500 text-2xs font-bold tracking-wider uppercase">Category Trends</Text>
        </View>
        <Text className="text-gray-500 text-sm italic">Not enough data across two months to calculate category trends yet.</Text>
      </View>);

  }

  const trendColor = insight.isLess ? '#10b981' : '#ef4444';
  const trendBg = insight.isLess ? 'bg-emerald-500/10' : 'bg-red-500/10';

  return (
    <View className="mx-6 mb-4 rounded-2xl bg-surface-base border border-card-base p-5">
      <View className="flex-row justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-card-base items-center justify-center mr-4">
            <Ionicons name="restaurant-outline" size={20} color="#10b981" />
          </View>
          <View className="flex-1 pr-2">
            <Text className="text-emerald-500 text-2xs font-bold tracking-wider uppercase mb-1">Category Trends</Text>
            <Text className="text-white font-medium text-15px leading-tight">
              You spent <Text style={{ color: trendColor }} className="font-bold">{insight.percentChange}% {insight.isLess ? 'less' : 'more'}</Text> on {insight.categoryName} compared to last month.
            </Text>
          </View>
        </View>
        
        <View className={`${trendBg} rounded-lg px-2 py-1 h-7 flex-row items-center justify-center`}>
          <Ionicons name={insight.isLess ? "arrow-down" : "arrow-up"} size={12} color={trendColor} />
          <Text style={{ color: trendColor }} className="text-xs font-bold ml-1">{insight.percentChange}%</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-end mt-3 ml-16">
        <Text className="text-gray-400 text-xs flex-1 pr-4">
          Your spending on {insight.categoryName} {insight.isLess ? 'decreased' : 'increased'} from {formatCurrency(insight.lastTotal)} to {formatCurrency(insight.currentTotal)}.
        </Text>
        
        <View className="w-24 h-10 relative">
           {}
           <View className="absolute bottom-2 left-0 right-0 h-[1px] bg-zinc-800" />
           <View className="absolute bottom-2 left-0 w-2 h-2 rounded-full bg-gray-500 -ml-1 -mb-1" />
           <View className="absolute bottom-2 right-0 w-2 h-2 rounded-full bg-emerald-500 -mr-1 -mb-1" />
           {}
           <View style={{ transform: [{ rotate: insight.isLess ? '10deg' : '-10deg' }] }} className="absolute bottom-3 left-0 right-0 h-[1px] bg-emerald-500 opacity-50 origin-left" />
           
           <Text className="absolute -bottom-2 left-0 text-3xs text-gray-500">Last</Text>
           <Text className="absolute -bottom-2 right-0 text-3xs text-emerald-500">This</Text>
        </View>
      </View>
    </View>);

}