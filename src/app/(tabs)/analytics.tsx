import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnalyticsHeader } from "../../components/analytics/analytics-header";
import { AnalyticsTabs, AnalyticsTabType } from "../../components/analytics/analytics-tabs";
import { AnalyticsSummaryCards } from "../../components/analytics/analytics-summary-cards";
import { CashFlowChart } from "../../components/analytics/cash-flow-chart";
import { CategorySpendingChart } from "../../components/analytics/category-spending-chart";
import { AnalyticsInsights } from "../../components/analytics/analytics-insights";

export default function AnalyticsScreen() {
  const [dateRange, setDateRange] = useState({ start: 0, end: 0 });
  const [dateLabel, setDateLabel] = useState("This Month");
  const [activeTab, setActiveTab] = useState<AnalyticsTabType>("Overview");

  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      <AnalyticsHeader 
        onDateRangeChange={(start, end, label) => {
          setDateRange({ start, end });
          setDateLabel(label);
        }} 
      />
      
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-white text-2xl font-bold mb-4">Analytics</Text>
        <AnalyticsTabs activeTab={activeTab} onChange={setActiveTab} />
        
        {dateRange.start > 0 && (
          <>
            <AnalyticsSummaryCards startDate={dateRange.start} endDate={dateRange.end} />
            
            {/* We could conditionally render these based on activeTab, but let's show all for "Overview" */}
            {(activeTab === "Overview" || activeTab === "Income" || activeTab === "Expense") && (
              <CashFlowChart startDate={dateRange.start} endDate={dateRange.end} dateLabel={dateLabel} />
            )}
            
            {(activeTab === "Overview" || activeTab === "Categories") && (
              <CategorySpendingChart startDate={dateRange.start} endDate={dateRange.end} dateLabel={dateLabel} />
            )}
            
            <AnalyticsInsights startDate={dateRange.start} endDate={dateRange.end} />
          </>
        )}

        {/* Extra padding for tab bar mock */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
