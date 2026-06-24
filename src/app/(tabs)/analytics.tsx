import { View, Text, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  useAnalyticsDatabase,
  CategorySpending,
} from "../../features/analytics/db/analyticsQueries";
import { AnalyticsFilter } from "../../features/analytics/components/AnalyticsFilter";
import { ExpensePieChart } from "../../features/analytics/components/ExpensePieChart";
import { TotalSpentCard } from "../../features/analytics/components/TotalSpentCard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

// Ref: analytics-1
function SkeletonPieChart() {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={animatedStyle}
      className="items-center justify-center py-10"
    >
      <View className="w-48 h-48 rounded-full bg-surface mb-8 border-4 border-background" />
      <View className="w-full">
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            className="flex-row items-center justify-between mb-4 px-4"
          >
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full bg-surface mr-3" />
              <View className="w-24 h-4 rounded-full bg-surface" />
            </View>
            <View className="w-16 h-4 rounded-full bg-surface" />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

export default function AnalyticsScreen() {
  const [spendingData, setSpendingData] = useState<CategorySpending[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isFirstLoad = useRef(true);

  const [dateRange, setDateRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const { getExpensesByCategory } = useAnalyticsDatabase();

  const prevDateRangeStr = useRef<string | null>(null);

  const loadData = useCallback(async () => {
    if (!dateRange) return;

    const currentRangeStr = JSON.stringify(dateRange);
    const isDateChange = prevDateRangeStr.current !== null && prevDateRangeStr.current !== currentRangeStr;
    const shouldShowSkeleton = isFirstLoad.current || isDateChange;

    if (shouldShowSkeleton) {
      setIsLoading(true);
      setSpendingData([]); // Ref: analytics-1
    }

    // Ref: analytics-2
    const data = await getExpensesByCategory(dateRange.start, dateRange.end);
    const total = data.reduce((sum, item) => sum + item.totalSpent, 0);
    
    // Ref: analytics-3
    setTotalSpent(total);

    if (shouldShowSkeleton) {
      // Ref: analytics-4
      setTimeout(() => {
        setSpendingData(data);
        setIsLoading(false);
        isFirstLoad.current = false;
        prevDateRangeStr.current = currentRangeStr;
      }, 600);
    } else {
      // Ref: analytics-5
      setSpendingData(data);
      setIsLoading(false);
      prevDateRangeStr.current = currentRangeStr;
    }
  }, [dateRange]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 24, paddingTop: 48 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-primary text-3xl font-bold mb-4">Analytics</Text>

      <AnalyticsFilter
        onDateRangeChange={(start, end) => setDateRange({ start, end })}
      />

      <TotalSpentCard totalSpent={totalSpent} />

      <Text className="text-xl font-bold text-primary mt-6 mb-4">
        Spending by Category
      </Text>

      {isLoading && spendingData.length === 0 ? (
        <SkeletonPieChart />
      ) : (
        <ExpensePieChart spendingData={spendingData} />
      )}
    </ScrollView>
  );
}
