import { View, Text, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  useAnalyticsDatabase,
  CategorySpending,
} from "../../../features/analytics/db/analyticsQueries";
import { AnalyticsFilter } from "../../../features/analytics/components/AnalyticsFilter";
import { TransactionPieChart } from "../../../features/analytics/components/TransactionPieChart";
import { TotalSpentCard } from "../../../features/analytics/components/TotalSpentCard";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../core/theme/ThemeContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  FadeIn,
} from "react-native-reanimated";



function SkeletonPieChart({ rowCount }: { rowCount: number }) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 750 }),
        withTiming(0.35, { duration: 750 }),
      ),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));


  const rows = Math.min(Math.max(rowCount, 3), 7);

  return (
    <Animated.View
      style={animStyle}
      className="bg-surface rounded-3xl border border-bordercolor overflow-hidden p-6 mb-8"
    >
      <View className="flex-row items-center w-full justify-between">
        {}
        <View
          className="rounded-full bg-bordercolor"
          style={{ width: 180, height: 180 }}
        />
        {}
        <View className="flex-1 ml-6 justify-center">
          {Array.from({ length: rows }).map((_, i) => (
            <View key={i} className="flex-row items-center mb-3">
              {}
              <View className="w-4 h-4 rounded-full bg-bordercolor mr-3" />
              <View>
                {}
                <View
                  className="h-3.5 bg-bordercolor rounded-md mb-1"
                  style={{ width: 60 + (i % 3) * 16 }}
                />
                {}
                <View className="h-3 w-10 bg-bordercolor rounded-md" />
              </View>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}


function EmptyAnalyticsState() {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="items-center justify-center py-16"
    >
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-5"
        style={{ backgroundColor: colors.surface }}
      >
        <Ionicons
          name="pie-chart-outline"
          size={44}
          color={colors.textTertiary}
        />
      </View>
      <Text className="text-primary font-bold text-xl mb-2 text-center">
        Nothing to analyse yet
      </Text>
      <Text className="text-tertiary text-center text-sm px-10 leading-6">
        Add some transactions to see your{"\n"}spending breakdown here.
      </Text>
    </Animated.View>
  );
}

export default function AnalyticsScreen() {
  const [spendingData, setSpendingData] = useState<CategorySpending[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const isFirstLoad = useRef(true);


  const prevRowCount = useRef(4);

  const [dateRange, setDateRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const handleDateRangeChange = useCallback((start: number, end: number) => {
    setDateRange((prev) => {
      if (prev?.start === start && prev?.end === end) return prev;
      return { start, end };
    });
  }, []);

  const { getTransactionsByCategory } = useAnalyticsDatabase();

  const prevDateRangeStr = useRef<string | null>(null);

  const loadData = useCallback(async () => {
    if (!dateRange) return;

    const currentRangeStr = JSON.stringify(dateRange);
    const isDateChange =
      prevDateRangeStr.current !== null &&
      prevDateRangeStr.current !== currentRangeStr;
    const shouldShowSkeleton = isFirstLoad.current || isDateChange;

    if (shouldShowSkeleton) {
      setIsLoading(true);
      setSpendingData([]);
    }

    const data = await getTransactionsByCategory(dateRange.start, dateRange.end);
    const total = data.reduce((sum, item) => sum + item.totalSpent, 0);


    if (data.length > 0) prevRowCount.current = data.length;

    setTotalSpent(total);

    setSpendingData(data);
    setIsLoading(false);
    setHasLoaded(true);
    isFirstLoad.current = false;
    prevDateRangeStr.current = currentRangeStr;
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
        onDateRangeChange={handleDateRangeChange}
      />

      <TotalSpentCard totalSpent={totalSpent} />

      <Text className="text-xl font-bold text-primary mt-6 mb-4">
        Spending by Category
      </Text>

      {isLoading ? (
        <SkeletonPieChart rowCount={prevRowCount.current} />
      ) : spendingData.length === 0 ? (
        <EmptyAnalyticsState />
      ) : (
        <Animated.View entering={FadeIn.duration(400)}>
          <TransactionPieChart spendingData={spendingData} />
        </Animated.View>
      )}
    </ScrollView>
  );
}
