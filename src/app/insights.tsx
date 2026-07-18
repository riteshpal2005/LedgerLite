import React from 'react';
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

interface InsightsScreenProps {
  currentMonthTxns: Transaction[];
  lastMonthTxns: Transaction[];
  categories: Category[];
}

const InsightsScreenComponent = ({ currentMonthTxns, lastMonthTxns, categories }: InsightsScreenProps) => {
  const currentDate = new Date();

  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      <InsightsHeader />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <InsightsHeroCard />

        <View className="px-6 mb-4 mt-2">
          <Text className="text-white font-bold text-lg">Key Insights</Text>
        </View>

        <CategoryTrendsCard 
          currentMonthTxns={currentMonthTxns} 
          lastMonthTxns={lastMonthTxns} 
          categories={categories} 
        />
        
        <LargestExpenseCard 
          currentMonthTxns={currentMonthTxns} 
          categories={categories} 
        />
        
        <HighActivityDayCard 
          currentMonthTxns={currentMonthTxns} 
        />
        
        <IncomeVsExpenseCard 
          currentMonthTxns={currentMonthTxns} 
        />
        
        <SpendingStreakCard 
          currentMonthTxns={currentMonthTxns} 
          currentDate={currentDate} 
        />

        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
};

const enhance = withObservables([], ({ database }: { database: Database }) => {
  const now = new Date();
  
  const currentMonthStart = startOfMonth(now).getTime();
  const currentMonthEnd = endOfMonth(now).getTime();
  
  const lastMonth = subMonths(now, 1);
  const lastMonthStart = startOfMonth(lastMonth).getTime();
  const lastMonthEnd = endOfMonth(lastMonth).getTime();

  return {
    currentMonthTxns: database.collections.get<Transaction>('transactions').query(
      Q.where('date', Q.between(currentMonthStart, currentMonthEnd))
    ).observe(),
    lastMonthTxns: database.collections.get<Transaction>('transactions').query(
      Q.where('date', Q.between(lastMonthStart, lastMonthEnd))
    ).observe(),
    categories: database.collections.get<Category>('categories').query().observe(),
  };
});

export default withDatabase(enhance(InsightsScreenComponent));
