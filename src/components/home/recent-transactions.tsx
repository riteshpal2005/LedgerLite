import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Ref: RecentTransactions-1
export function RecentTransactions() {
  return (
    <View>
      <View className="flex-row justify-between items-end mb-3">
        <Text className="text-white text-lg font-bold">Recent Transactions</Text>
        <TouchableOpacity>
          <Text className="text-[#6642f8] text-sm font-bold">See all</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-[#0f1011] rounded-2xl p-2 mb-8">
        {/* Transaction 1 */}
        <View className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-[#12281a] rounded-full items-center justify-center mr-3">
              <Ionicons name="cash" size={20} color="#22c55e" />
            </View>
            <View>
              <Text className="text-white text-base font-bold">Salary</Text>
              <Text className="text-gray-400 text-xs mt-1">Jun 12, 2025</Text>
            </View>
          </View>
          <Text className="text-green-500 text-base font-bold">+ ₹45,000.00</Text>
        </View>
        
        <View className="h-px bg-[#1b1b1c] mx-3" />

        {/* Transaction 2 */}
        <View className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-[#1b1b1c] rounded-full items-center justify-center mr-3">
              <Ionicons name="cart" size={20} color="white" />
            </View>
            <View>
              <Text className="text-white text-base font-bold">Grocery</Text>
              <Text className="text-gray-400 text-xs mt-1">Jun 11, 2025</Text>
            </View>
          </View>
          <Text className="text-red-500 text-base font-bold">- ₹1,250.00</Text>
        </View>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        {/* Transaction 3 */}
        <View className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-3">
              <Ionicons name="briefcase" size={20} color="white" />
            </View>
            <View>
              <Text className="text-white text-base font-bold">Freelance</Text>
              <Text className="text-gray-400 text-xs mt-1">Jun 10, 2025</Text>
            </View>
          </View>
          <Text className="text-green-500 text-base font-bold">+ ₹8,000.00</Text>
        </View>
        
        <View className="h-px bg-[#1b1b1c] mx-3" />

        {/* Transaction 4 */}
        <View className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-[#2d2208] rounded-full items-center justify-center mr-3">
              <Ionicons name="flash" size={20} color="#eab308" />
            </View>
            <View>
              <Text className="text-white text-base font-bold">Electricity Bill</Text>
              <Text className="text-gray-400 text-xs mt-1">Jun 9, 2025</Text>
            </View>
          </View>
          <Text className="text-red-500 text-base font-bold">- ₹1,890.00</Text>
        </View>
      </View>
    </View>
  );
}
