import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function QuickActions() {
  const router = useRouter();

  return (
    <>
      <Text className="text-white text-base font-bold mb-3">Quick Actions</Text>
      <View className="flex-row justify-between mb-8">
        <TouchableOpacity 
          onPress={() => router.push("/add-transaction")}
          className="bg-[#0f1011] py-4 px-2 rounded-2xl flex-1 items-center justify-center mr-2 border border-[#1b1b1c]"
        >
          <View className="w-10 h-10 rounded-full border border-purple-500/30 items-center justify-center mb-2">
            <Ionicons name="add" size={20} color="#a855f7" />
          </View>
          <Text className="text-gray-300 text-[10px] text-center">Add Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push("/categories")}
          className="bg-[#0f1011] py-4 px-2 rounded-2xl flex-1 items-center justify-center mr-2 border border-[#1b1b1c]"
        >
          <View className="w-10 h-10 rounded-full border border-blue-500/30 items-center justify-center mb-2">
            <Ionicons name="document-text-outline" size={18} color="#3b82f6" />
          </View>
          <Text className="text-gray-300 text-[10px] text-center">Add Category</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#0f1011] py-4 px-2 rounded-2xl flex-1 items-center justify-center mr-2 border border-[#1b1b1c]">
          <View className="w-10 h-10 rounded-full border border-green-500/30 items-center justify-center mb-2">
            <Ionicons name="download-outline" size={18} color="#22c55e" />
          </View>
          <Text className="text-gray-300 text-[10px] text-center">Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#0f1011] py-4 px-2 rounded-2xl flex-1 items-center justify-center border border-[#1b1b1c]">
          <View className="w-10 h-10 rounded-full border border-purple-500/30 items-center justify-center mb-2">
            <Ionicons name="pie-chart-outline" size={18} color="#a855f7" />
          </View>
          <Text className="text-gray-300 text-[10px] text-center">Reports</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
