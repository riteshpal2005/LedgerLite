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
          className="bg-surface-base py-4 px-1 rounded-2xl flex-1 items-center justify-center mr-2 border border-card-base">
          
          <View className="w-10 h-10 rounded-full border border-brand-purple/50 items-center justify-center mb-2">
            <Ionicons name="add" size={24} color="#a855f7" />
          </View>
          <Text className="text-gray-300 text-2xs text-center">Add Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/categories")}
          className="bg-surface-base py-4 px-1 rounded-2xl flex-1 items-center justify-center mr-2 border border-card-base">
          
          <View className="w-10 h-10 rounded-full border border-blue-500/50 items-center justify-center mb-2">
            <Ionicons name="pricetag-outline" size={20} color="#3b82f6" />
          </View>
          <Text className="text-gray-300 text-2xs text-center">Add Category</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-surface-base py-4 px-1 rounded-2xl flex-1 items-center justify-center mr-2 border border-card-base">
          <View className="w-10 h-10 rounded-full border border-green-500/50 items-center justify-center mb-2">
            <Ionicons name="download-outline" size={20} color="#22c55e" />
          </View>
          <Text className="text-gray-300 text-2xs text-center">Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-surface-base py-4 px-1 rounded-2xl flex-1 items-center justify-center border border-card-base">
          <View className="w-10 h-10 rounded-full border border-brand-purple/50 items-center justify-center mb-2">
            <Ionicons name="pie-chart-outline" size={20} color="#a855f7" />
          </View>
          <Text className="text-gray-300 text-2xs text-center">Reports</Text>
        </TouchableOpacity>
      </View>
    </>);

}