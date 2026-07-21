import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Transaction from '../../../server/db/models/Transaction';
import { getDay } from 'date-fns';

interface HighActivityDayCardProps {
  currentMonthTxns: Transaction[];
}

export function HighActivityDayCard({ currentMonthTxns }: HighActivityDayCardProps) {
  const insight = useMemo(() => {
    const expenses = currentMonthTxns.filter((t) => t.type === 'debit');


    if (expenses.length < 5) return null;


    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    expenses.forEach((t) => {
      const dayIndex = getDay(new Date(t.date));
      dayCounts[dayIndex]++;
    });

    let maxDayIndex = 0;
    let maxCount = dayCounts[0];
    for (let i = 1; i < 7; i++) {
      if (dayCounts[i] > maxCount) {
        maxCount = dayCounts[i];
        maxDayIndex = i;
      }
    }

    const days = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
    const totalExpenses = expenses.length;
    const percentage = Math.round(maxCount / totalExpenses * 100);


    const uiDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const uiCounts = [
    dayCounts[1], dayCounts[2], dayCounts[3], dayCounts[4],
    dayCounts[5], dayCounts[6], dayCounts[0]];

    const uiMaxIndex = uiCounts.indexOf(maxCount);

    return {
      dayName: days[maxDayIndex],
      percentage,
      uiDays,
      uiCounts,
      uiMaxIndex,
      maxCount
    };
  }, [currentMonthTxns]);

  if (!insight) {
    return (
      <View className="mx-6 mb-4 rounded-2xl bg-surface-base border border-card-base p-5">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-card-base items-center justify-center mr-3">
            <Ionicons name="calendar-outline" size={18} color="#71717a" />
          </View>
          <Text className="text-brand-purple text-2xs font-bold tracking-wider uppercase">High Activity Day</Text>
        </View>
        <Text className="text-gray-500 text-sm italic">Not enough transaction history this month to determine your highest activity day.</Text>
      </View>);

  }

  return (
    <View className="mx-6 mb-4 rounded-2xl bg-surface-base border border-card-base p-5">
      <View className="flex-row justify-between mb-4">
        <View className="flex-row flex-1 pr-4">
          <View className="w-12 h-12 rounded-full bg-card-base items-center justify-center mr-4 mt-1">
            <Ionicons name="calendar-outline" size={20} color="#a855f7" />
          </View>
          <View className="flex-1">
            <Text className="text-brand-purple text-2xs font-bold tracking-wider uppercase mb-1">High Activity Day</Text>
            <Text className="text-white font-medium text-15px leading-tight">
              You tend to spend the most on <Text className="text-brand-purple font-bold">{insight.dayName}</Text>.
            </Text>
          </View>
        </View>
        
        {}
        <View className="w-24 h-16 flex-row items-end justify-between pt-4 pb-4 relative">
          <View className="absolute -top-3 left-0 right-0 items-center opacity-0">
             {}
          </View>
          
          {insight.uiCounts.map((count, i) => {
            const isMax = i === insight.uiMaxIndex;

            const heightRatio = insight.maxCount === 0 ? 0.1 : count / insight.maxCount;

            const heightStyle = { height: Math.max(4, heightRatio * 40) };

            return (
              <View key={i} className="items-center relative w-2.5">
                {isMax &&
                <View className="absolute -top-5 bg-brand-purple/20 rounded px-1 py-0.5 whitespace-nowrap z-10 w-8 items-center -ml-[10px]">
                    <Text className="text-brand-purple text-3xs font-bold">{insight.percentage}%</Text>
                  </View>
                }
                <View
                  style={heightStyle}
                  className={`w-full rounded-t-sm ${isMax ? 'bg-brand-purple' : 'bg-zinc-800'}`} />
                
                <Text className="text-3xs text-gray-500 mt-1 absolute -bottom-4">{insight.uiDays[i]}</Text>
              </View>);

          })}
        </View>
      </View>

      <View className="ml-16">
        <Text className="text-gray-400 text-xs leading-relaxed">
          {insight.percentage}% of your total transactions happen on {insight.dayName}.
        </Text>
      </View>
    </View>);

}