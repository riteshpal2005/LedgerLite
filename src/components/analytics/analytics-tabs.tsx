import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export type AnalyticsTabType = "Overview" | "Income" | "Expense" | "Categories";

interface AnalyticsTabsProps {
  activeTab: AnalyticsTabType;
  onChange: (tab: AnalyticsTabType) => void;
}

// Ref: AnalyticsTabs-1
export function AnalyticsTabs({ activeTab, onChange }: AnalyticsTabsProps) {
  return (
    <View className="flex-row bg-[#0f1011] rounded-xl p-1 mb-6">
      <TouchableOpacity 
        onPress={() => onChange("Overview")}
        className={`flex-1 items-center justify-center py-2 rounded-lg ${activeTab === "Overview" ? "bg-[#1b1b1c] border border-[#6642f8]/30" : ""}`}
      >
        <Text className={`font-bold text-xs ${activeTab === "Overview" ? "text-[#6642f8]" : "text-gray-400"}`}>Overview</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => onChange("Income")}
        className={`flex-1 items-center justify-center py-2 rounded-lg ${activeTab === "Income" ? "bg-[#1b1b1c] border border-green-500/30" : ""}`}
      >
        <Text className={`font-bold text-xs ${activeTab === "Income" ? "text-green-500" : "text-gray-400"}`}>Income</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => onChange("Expense")}
        className={`flex-1 items-center justify-center py-2 rounded-lg ${activeTab === "Expense" ? "bg-[#1b1b1c] border border-red-500/30" : ""}`}
      >
        <Text className={`font-bold text-xs ${activeTab === "Expense" ? "text-red-500" : "text-gray-400"}`}>Expense</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => onChange("Categories")}
        className={`flex-1 items-center justify-center py-2 rounded-lg ${activeTab === "Categories" ? "bg-[#1b1b1c] border border-gray-400/30" : ""}`}
      >
        <Text className={`font-bold text-xs ${activeTab === "Categories" ? "text-white" : "text-gray-400"}`}>Categories</Text>
      </TouchableOpacity>
    </View>
  );
}
