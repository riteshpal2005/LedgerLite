import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TransactionsHeaderProps {
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
}


export function TransactionsHeader({ onSearchPress, onFilterPress, hasActiveFilters }: TransactionsHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 mt-4 mb-2">
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-brand-primary rounded-xl items-center justify-center mr-3">
          <Ionicons name="book" size={24} color="white" />
        </View>
        <View>
          <Text className="text-white text-2xl font-bold">
            Ledger<Text className="text-brand-primary">Lite</Text>
          </Text>
          <Text className="text-gray-400 text-xs">Transaction Tracker</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity className="mr-4" onPress={onSearchPress}>
          <Ionicons name="search-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onFilterPress}>
          <Ionicons name="funnel-outline" size={24} color={hasActiveFilters ? "#3b82f6" : "white"} />
        </TouchableOpacity>
      </View>
    </View>);

}