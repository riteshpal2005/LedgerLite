import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function AddTransactionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mt-4 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Add Transaction</Text>
        <TouchableOpacity className="w-10 items-end">
          <Text className="text-[#6642f8] font-bold text-base">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        
        {/* Transaction Type Tabs */}
        <View className="flex-row bg-[#0f1011] rounded-xl p-1 mb-6 border border-[#1b1b1c]">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2.5 bg-[#1b1b1c] rounded-lg border border-[#6642f8]/30">
            <Ionicons name="arrow-down" size={16} color="#ef4444" className="mr-1.5" />
            <Text className="text-white font-bold text-xs">Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2.5">
            <Ionicons name="arrow-up" size={16} color="#22c55e" className="mr-1.5" />
            <Text className="text-gray-400 font-bold text-xs">Income</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2.5">
            <Ionicons name="swap-horizontal" size={16} color="#6642f8" className="mr-1.5" />
            <Text className="text-gray-400 font-bold text-xs">Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Account Selection */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Account</Text>
        <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-3 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-900 rounded-full items-center justify-center mr-3">
              <Ionicons name="business-outline" size={20} color="white" />
            </View>
            <View>
              <Text className="text-white text-sm font-bold">SBI Bank Account</Text>
              <Text className="text-gray-400 text-xs mt-0.5">₹1,20,300.00</Text>
            </View>
          </View>
          <Ionicons name="chevron-down" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Amount Input */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Amount</Text>
        <View className="bg-[#0f1011] rounded-2xl p-4 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
          <View className="flex-row items-center">
            <Text className="text-red-500 text-2xl font-bold mr-2">₹</Text>
            <Text className="text-white text-3xl font-bold tracking-wider">1,250.00</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="calculator-outline" size={24} color="#6642f8" />
          </TouchableOpacity>
        </View>

        {/* Category Selection */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Category</Text>
        <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-3 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-red-500 rounded-full items-center justify-center mr-3">
              <Ionicons name="cart-outline" size={20} color="white" />
            </View>
            <Text className="text-white text-sm font-bold">Food & Groceries</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Date and Time Row */}
        <View className="flex-row justify-between mb-6">
          {/* Date */}
          <View className="flex-1 mr-3">
            <Text className="text-gray-400 text-xs mb-2 ml-1">Date</Text>
            <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-3.5 flex-row items-center justify-between border border-[#1b1b1c]">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={18} color="#9ca3af" className="mr-2" />
                <Text className="text-white text-sm">13 Jun 2025</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Time */}
          <View className="flex-1 ml-1">
            <Text className="text-gray-400 text-xs mb-2 ml-1">Time</Text>
            <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-3.5 flex-row items-center justify-between border border-[#1b1b1c]">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#9ca3af" className="mr-2" />
                <Text className="text-white text-sm">12:30 PM</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Notes (Optional)</Text>
        <View className="bg-[#0f1011] rounded-2xl p-3 mb-6 border border-[#1b1b1c] h-28 justify-between">
          <TextInput
            placeholder="Add a note..."
            placeholderTextColor="#6b7280"
            className="text-white text-sm flex-1"
            multiline
            textAlignVertical="top"
          />
          <Text className="text-gray-600 text-xs text-right">0/200</Text>
        </View>

        {/* Tags */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Tags (Optional)</Text>
        <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-4 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
          <View className="flex-row items-center">
            <Ionicons name="pricetag-outline" size={20} color="#6642f8" className="mr-3" />
            <Text className="text-gray-500 text-sm">Add tags...</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        {/* Attach Receipt */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Attach Receipt (Optional)</Text>
        <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-6 items-center justify-center mb-8 border border-dashed border-[#1b1b1c]">
          <View className="flex-row items-center mb-2">
            <Ionicons name="cloud-upload-outline" size={20} color="#6642f8" className="mr-2" />
            <Text className="text-white text-sm font-bold">Upload Receipt</Text>
          </View>
          <Text className="text-gray-500 text-[10px]">JPG, PNG, PDF (Max 5MB)</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Sticky Save Button */}
      <View className="px-4 pb-6 pt-2 bg-[#0a0b0d]">
        <TouchableOpacity className="bg-[#6642f8] rounded-2xl p-4 items-center justify-center">
          <Text className="text-white text-base font-bold">Save Transaction</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
