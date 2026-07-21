import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

export type AnalyticsTabType = "Overview" | "Income" | "Expense" | "Categories";

interface AnalyticsTabsProps {
  activeTab: AnalyticsTabType;
  onChange: (tab: AnalyticsTabType) => void;
}

export function AnalyticsTabs({ activeTab, onChange }: AnalyticsTabsProps) {
  return (
    <View className="flex-row bg-[#0f1011] rounded-2xl p-1 mb-6 border border-[#1b1b1c] items-center">
      <TouchableOpacity
        onPress={() => onChange("Overview")}
        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${activeTab === "Overview" ? "bg-[#6642f8]/20 border border-[#6642f8]/30" : ""}`}>
        
        <Text className={`font-bold text-xs ${activeTab === "Overview" ? "text-[#6642f8]" : "text-gray-400"}`}>Overview</Text>
      </TouchableOpacity>
      
      {activeTab !== "Overview" && activeTab !== "Income" && <View className="w-px h-6 bg-[#1b1b1c]" />}

      <TouchableOpacity
        onPress={() => onChange("Income")}
        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${activeTab === "Income" ? "bg-[#22c55e]/10 border border-[#22c55e]/30" : ""}`}>
        
        <Ionicons name="trending-up" size={14} color={activeTab === "Income" ? "#22c55e" : "#22c55e"} className="mr-1.5" />
        <Text className={`font-bold text-xs ${activeTab === "Income" ? "text-green-500" : "text-gray-400"}`}>Income</Text>
      </TouchableOpacity>
      
      {activeTab !== "Income" && activeTab !== "Expense" && <View className="w-px h-6 bg-[#1b1b1c]" />}

      <TouchableOpacity
        onPress={() => onChange("Expense")}
        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${activeTab === "Expense" ? "bg-[#ef4444]/10 border border-[#ef4444]/30" : ""}`}>
        
        <Ionicons name="trending-down" size={14} color={activeTab === "Expense" ? "#ef4444" : "#ef4444"} className="mr-1.5" />
        <Text className={`font-bold text-xs ${activeTab === "Expense" ? "text-red-500" : "text-gray-400"}`}>Expense</Text>
      </TouchableOpacity>
      
      {activeTab !== "Expense" && activeTab !== "Categories" && <View className="w-px h-6 bg-[#1b1b1c]" />}

      <TouchableOpacity
        onPress={() => onChange("Categories")}
        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${activeTab === "Categories" ? "bg-gray-800 border border-gray-600/30" : ""}`}>
        
        <Ionicons name="pie-chart-outline" size={14} color={activeTab === "Categories" ? "white" : "#9ca3af"} className="mr-1.5" />
        <Text className={`font-bold text-xs ${activeTab === "Categories" ? "text-white" : "text-gray-400"}`}>Categories</Text>
      </TouchableOpacity>
    </View>);

}