import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Ref: OverviewCard-1
export function OverviewCard() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  return (
    <View>
      <View className="flex-row justify-between items-end mb-3">
        <Text className="text-white text-lg font-bold">Overview</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-gray-300 text-sm mr-1">This Month</Text>
          <Ionicons name="chevron-down" size={16} color="#d1d5db" />
        </TouchableOpacity>
      </View>

      <View className="bg-[#0f1011] rounded-2xl p-5 mb-8">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-400 text-sm">Total Balance</Text>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
            <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={24} color="#d1d5db" />
          </TouchableOpacity>
        </View>
        <Text className="text-white text-4xl font-bold mb-4">
          {isBalanceVisible ? "₹48,650.00" : "••••••••"}
        </Text>
        
        <View className="h-px bg-[#1b1b1c] w-full mb-4" />
        
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-green-500 text-sm mb-1">Income</Text>
            <Text className="text-green-500 text-lg font-bold">
              {isBalanceVisible ? "₹80,240.00" : "••••••••"}
            </Text>
          </View>
          <View className="w-px h-10 bg-[#1b1b1c] mx-4" />
          <View className="flex-1">
            <Text className="text-red-500 text-sm mb-1">Expense</Text>
            <Text className="text-white text-lg font-bold">
              {isBalanceVisible ? "₹31,590.00" : "••••••••"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
