import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withDatabase } from '@nozbe/watermelondb/react';
import withObservables from '@nozbe/watermelondb/react/withObservables';
import { Database, Q } from '@nozbe/watermelondb';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

import Transaction from '../server/db/models/Transaction';
import Category from '../server/db/models/Category';

import { InsightsHeader } from '../components/analytics/insights/insights-header';
import { InsightsHeroCard } from '../components/analytics/insights/insights-hero-card';
import { CategoryTrendsCard } from '../components/analytics/insights/category-trends-card';
import { LargestExpenseCard } from '../components/analytics/insights/largest-expense-card';
import { HighActivityDayCard } from '../components/analytics/insights/high-activity-day-card';
import { IncomeVsExpenseCard } from '../components/analytics/insights/income-vs-expense-card';
import { SpendingStreakCard } from '../components/analytics/insights/spending-streak-card';

interface InsightsContentProps {
  currentMonthTxns: Transaction[];
  lastMonthTxns: Transaction[];
  categories: Category[];
  startDate: number;
}

const InsightsContentComponent = ({ currentMonthTxns, lastMonthTxns, categories, startDate }: InsightsContentProps) => {
  const currentDate = new Date(startDate);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="h-4" />
      <InsightsHeroCard />

      <View className="px-6 mb-4 mt-2">
        <Text className="text-white font-bold text-lg">Key Insights</Text>
      </View>

      <CategoryTrendsCard
        currentMonthTxns={currentMonthTxns}
        lastMonthTxns={lastMonthTxns}
        categories={categories} />
      
      
      <LargestExpenseCard
        currentMonthTxns={currentMonthTxns}
        categories={categories} />
      
      
      <HighActivityDayCard
        currentMonthTxns={currentMonthTxns} />
      
      
      <IncomeVsExpenseCard
        currentMonthTxns={currentMonthTxns} />
      
      
      <SpendingStreakCard
        currentMonthTxns={currentMonthTxns}
        currentDate={currentDate} />
      

      {}
    </ScrollView>);

};

const enhance = withObservables(['startDate', 'endDate', 'prevStartDate', 'prevEndDate'], ({ database, startDate, endDate, prevStartDate, prevEndDate }: {database: Database;startDate: number;endDate: number;prevStartDate: number;prevEndDate: number;}) => ({
  currentMonthTxns: database.collections.get<Transaction>('transactions').query(
    Q.where('date', Q.between(startDate, endDate))
  ).observe(),
  lastMonthTxns: database.collections.get<Transaction>('transactions').query(
    Q.where('date', Q.between(prevStartDate, prevEndDate))
  ).observe(),
  categories: database.collections.get<Category>('categories').query().observe()
}));

const EnhancedInsightsContent = withDatabase(enhance(InsightsContentComponent));

export default function InsightsScreen() {
  const now = new Date();
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(now).getTime(),
    end: endOfMonth(now).getTime(),
    prevStart: startOfMonth(subMonths(now, 1)).getTime(),
    prevEnd: endOfMonth(subMonths(now, 1)).getTime()
  });

  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <InsightsHeader
        onDateRangeChange={(start, end, label, prevStart, prevEnd) => {
          setDateRange({ start, end, prevStart, prevEnd });
        }} />
      
      
      {dateRange.start > 0 &&
      <EnhancedInsightsContent
        startDate={dateRange.start}
        endDate={dateRange.end}
        prevStartDate={dateRange.prevStart}
        prevEndDate={dateRange.prevEnd} />

      }
    </SafeAreaView>);

}