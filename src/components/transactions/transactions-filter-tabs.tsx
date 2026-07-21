import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

export type FilterType = "All" | "Income" | "Expense";

interface TransactionsFilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TransactionsFilterTabs({ activeFilter, onFilterChange }: TransactionsFilterTabsProps) {
  return (
    <View className="flex-row bg-surface-base rounded-2xl p-1 mb-6 border border-card-base items-center">
      <TouchableOpacity
        onPress={() => onFilterChange("All")}
        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${activeFilter === "All" ? "bg-brand-primary/10 border border-brand-primary" : ""}`}>
        
        <Ionicons name="grid-outline" size={18} color={activeFilter === "All" ? "#6642f8" : "#6b7280"} className="mr-2" />
        <Text className={`font-bold ml-2 ${activeFilter === "All" ? "text-brand-primary" : "text-gray-400"}`}>All</Text>
      </TouchableOpacity>
      
      {activeFilter !== "All" && activeFilter !== "Income" && <View className="w-px h-6 bg-card-base" />}

      <TouchableOpacity
        onPress={() => onFilterChange("Income")}
        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${activeFilter === "Income" ? "bg-green-500/10 border border-green-500" : ""}`}>
        
        <Ionicons name="trending-up" size={18} color={activeFilter === "Income" ? "#22c55e" : "#22c55e"} className="mr-2" />
        <Text className={`font-bold ml-2 ${activeFilter === "Income" ? "text-green-500" : "text-green-500"}`}>Income</Text>
      </TouchableOpacity>
      
      {activeFilter !== "Income" && activeFilter !== "Expense" && <View className="w-px h-6 bg-card-base" />}

      <TouchableOpacity
        onPress={() => onFilterChange("Expense")}
        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${activeFilter === "Expense" ? "bg-red-500/10 border border-red-500" : ""}`}>
        
        <Ionicons name="trending-down" size={18} color={activeFilter === "Expense" ? "#ef4444" : "#ef4444"} className="mr-2" />
        <Text className={`font-bold ml-2 ${activeFilter === "Expense" ? "text-red-500" : "text-red-500"}`}>Expense</Text>
      </TouchableOpacity>
    </View>);

}