import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export type FilterType = "All" | "Income" | "Expense";

interface TransactionsFilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

// Ref: TransactionsFilterTabs-1
export function TransactionsFilterTabs({ activeFilter, onFilterChange }: TransactionsFilterTabsProps) {
  return (
    <View className="flex-row bg-[#0f1011] rounded-xl p-1 mb-6">
      <TouchableOpacity 
        onPress={() => onFilterChange("All")}
        className={`flex-1 items-center justify-center py-2 rounded-lg ${activeFilter === "All" ? "bg-[#1b1b1c] border border-[#6642f8]/30" : ""}`}
      >
        <Text className={`font-bold ${activeFilter === "All" ? "text-[#6642f8]" : "text-gray-400"}`}>All</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => onFilterChange("Income")}
        className={`flex-1 items-center justify-center py-2 rounded-lg ${activeFilter === "Income" ? "bg-[#1b1b1c] border border-green-500/30" : ""}`}
      >
        <Text className={`font-bold ${activeFilter === "Income" ? "text-green-500" : "text-gray-400"}`}>Income</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => onFilterChange("Expense")}
        className={`flex-1 items-center justify-center py-2 rounded-lg ${activeFilter === "Expense" ? "bg-[#1b1b1c] border border-red-500/30" : ""}`}
      >
        <Text className={`font-bold ${activeFilter === "Expense" ? "text-red-500" : "text-gray-400"}`}>Expense</Text>
      </TouchableOpacity>
    </View>
  );
}
