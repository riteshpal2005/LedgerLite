import { View, Text, Dimensions } from "react-native";
import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { useExpenseDatabase } from "../../core/database/useExpenseDatabase";
import { LineChart } from 'react-native-chart-kit';
import { RootState } from "../../core/store/store";
import { useSelector } from "react-redux";

export default function AnalyticsScreen() {

  const [totalSpent, setTotalSpent] = useState(0);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: 0 });
  const { getTotalSpent } = useExpenseDatabase();

  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const recentExpenses = expenses.slice(0, 7).reverse();
  const chartLabels = recentExpenses.length > 0 ? recentExpenses.map(e => e.merchant || e.description.substring(0, 5)) : ['Empty'];
  const chartData = recentExpenses.length > 0 ? recentExpenses.map(e => e.amount) : [0];

  useFocusEffect(useCallback(() => {
    const loadTotal = async () => {
      const sum = await getTotalSpent();
      setTotalSpent(sum);
    };
    loadTotal();
  }, [])
  );

  return (
    <View className="flex-1 p-6 pt-12 bg-zinc-950">
      <Text className="text-white text-3xl font-bold mb-8">Analytics</Text>
      <View className="bg-blue-600 rounded-3xl p-6 mb-8 shadow-lg">
        <Text className="text-blue-200 text-lg font-semibold mb-2">Total Spent</Text>
        <Text className="text-white text-5xl font-bold">₹{totalSpent.toFixed(2)}</Text>
      </View>
      <Text className="text-xl font-bold text-white mb-4">Spending Trends</Text>
      <View className="rounded-3xl border border-zinc-800 bg-zinc-900 mt-2">
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [{ data: chartData }]
          }}
          width={Dimensions.get('window').width - 48}
          height={220}
          yAxisLabel="₹"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#18181b',
            backgroundGradientFrom: '#18181b',
            backgroundGradientTo: '#09090b',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#2563eb'
            }
          }}
          bezier
          style={{
            marginVertical: 8, borderRadius: 16
          }}
          onDataPointClick={(data) => {
            setTooltip({
              visible: true,
              x: data.x,
              y: data.y,
              value: data.value
            });
          }}
        />
        {tooltip.visible && (
          <View
            className="absolute bg-zinc-800 rounded-lg px-3 py-1.5 shadow-xl border border.zinc.700"
            style={{
              top: Math.max(0, tooltip.y - 40),
              left: tooltip.x - 25,
            }}
          >
            <Text className="text-white ont-bold">₹{tooltip.value}</Text>
          </View>
        )}
      </View>
    </View>
  );
}