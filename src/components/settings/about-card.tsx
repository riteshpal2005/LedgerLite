import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function AboutCard() {
  return (
    <View className="bg-[#0f1011] rounded-2xl p-2 mb-6 border border-[#1b1b1c]">
      <TouchableOpacity className="flex-row justify-between items-center p-3">
        <View className="flex-row items-center">
          <Ionicons name="information-circle-outline" size={20} color="#9ca3af" className="mr-4" />
          <View>
            <Text className="text-white text-sm font-bold">About LedgerLite</Text>
            <Text className="text-gray-400 text-xs mt-0.5">Version 1.0.0</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );
}
