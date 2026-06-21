import { View, Text } from "react-native";

interface TotalSpentCardProps {
  totalSpent: number;
}

export function TotalSpentCard({ totalSpent }: TotalSpentCardProps) {
  return (
    <View className="bg-blue-600 rounded-3xl p-6 mb-8 shadow-lg">
      <Text className="text-blue-200 text-lg font-semibold mb-2">Total Spent (Filtered)</Text>
      <Text className="text-white text-5xl font-bold">₹{totalSpent.toFixed(2)}</Text>
    </View>
  );
}
