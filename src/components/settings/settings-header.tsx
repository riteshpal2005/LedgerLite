import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function SettingsHeader() {
  return (
    <View className="flex-row items-center justify-between px-6 mt-4 mb-6">
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-[#6642f8] rounded-xl items-center justify-center mr-3">
          <Ionicons name="book" size={24} color="white" />
        </View>
        <View>
          <Text className="text-white text-2xl font-bold">
            Ledger<Text className="text-[#6642f8]">Lite</Text>
          </Text>
          <Text className="text-gray-400 text-xs">Transaction Tracker</Text>
        </View>
      </View>
    </View>
  );
}
