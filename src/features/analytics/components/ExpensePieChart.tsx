import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { CategorySpending } from "../db/analyticsQueries";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";

interface ExpensePieChartProps {
  spendingData: CategorySpending[];
}

export function ExpensePieChart({ spendingData }: ExpensePieChartProps) {
  const categories = useSelector((state: RootState) => state.categories.categories);

  // Ref: ExpensePieChart-1
  const chartData = spendingData.map(item => {
    const category = categories.find(c => c.id === item.categoryId);
    return {
      name: category?.name || "Unknown",
      population: item.totalSpent,
      color: category?.color || "#52525b",
      legendFontColor: "#a1a1aa",
      legendFontSize: 14
    };
  });

  if (chartData.length === 0) {
    return (
      <View className="items-center justify-center h-48 bg-zinc-900 rounded-3xl border border-zinc-800">
        <Text className="text-zinc-500 text-lg">No expenses in this range</Text>
      </View>
    );
  }

  return (
    <View className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden items-center justify-center p-4">
      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 48}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 0]}
        absolute // Ref: ExpensePieChart-2
      />
    </View>
  );
}
