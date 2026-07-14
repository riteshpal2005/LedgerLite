import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 mt-4 mb-2">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-[#6642f8] rounded-xl items-center justify-center mr-3">
            <Ionicons name="book" size={24} color="white" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">
              Ledger<Text className="text-[#6642f8]">Lite</Text>
            </Text>
            <Text className="text-gray-400 text-xs">Transaction Tracker</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="funnel-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-white text-2xl font-bold mb-4">Transactions</Text>

        {/* Filter Tabs */}
        <View className="flex-row bg-[#0f1011] rounded-xl p-1 mb-6">
          <TouchableOpacity className="flex-1 items-center justify-center py-2 bg-[#1b1b1c] rounded-lg border border-[#6642f8]/30">
            <Text className="text-[#6642f8] font-bold">All</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center justify-center py-2">
            <Text className="text-green-500 font-bold">Income</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center justify-center py-2">
            <Text className="text-red-500 font-bold">Expense</Text>
          </TouchableOpacity>
        </View>

        {/* June 2025 Section */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-base font-bold">June 2025</Text>
          <View className="flex-row items-center">
            <Text className="text-[#6642f8] text-sm font-bold mr-1">₹13,450.00</Text>
            <Ionicons name="chevron-up" size={16} color="#6642f8" />
          </View>
        </View>

        <View className="bg-[#0f1011] rounded-2xl p-2 mb-6">
          {/* Transaction 1 */}
          <View className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-[#12281a] rounded-full items-center justify-center mr-3">
                <Ionicons name="cash-outline" size={20} color="#22c55e" />
              </View>
              <View>
                <Text className="text-white text-base font-bold">Salary</Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mr-1.5" />
                  <Text className="text-gray-400 text-xs">Income</Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs mb-1">Jun 12, 2025</Text>
              <Text className="text-green-500 text-base font-bold">+ ₹45,000.00</Text>
            </View>
          </View>
          
          <View className="h-px bg-[#1b1b1c] mx-3" />

          {/* Transaction 2 */}
          <View className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-[#1b1b1c] rounded-full items-center justify-center mr-3">
                <Ionicons name="cart-outline" size={20} color="white" />
              </View>
              <View>
                <Text className="text-white text-base font-bold">Grocery</Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
                  <Text className="text-gray-400 text-xs">Food</Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs mb-1">Jun 11, 2025</Text>
              <Text className="text-red-500 text-base font-bold">- ₹1,250.00</Text>
            </View>
          </View>

          <View className="h-px bg-[#1b1b1c] mx-3" />

          {/* Transaction 3 */}
          <View className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-900/40 rounded-full items-center justify-center mr-3">
                <Ionicons name="clipboard-outline" size={20} color="#60a5fa" />
              </View>
              <View>
                <Text className="text-white text-base font-bold">Freelance Project</Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mr-1.5" />
                  <Text className="text-gray-400 text-xs">Income</Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs mb-1">Jun 10, 2025</Text>
              <Text className="text-green-500 text-base font-bold">+ ₹8,000.00</Text>
            </View>
          </View>
          
          <View className="h-px bg-[#1b1b1c] mx-3" />

          {/* Transaction 4 */}
          <View className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-yellow-900/30 rounded-full items-center justify-center mr-3">
                <Ionicons name="flash-outline" size={20} color="#eab308" />
              </View>
              <View>
                <Text className="text-white text-base font-bold">Electricity Bill</Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
                  <Text className="text-gray-400 text-xs">Utilities</Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs mb-1">Jun 9, 2025</Text>
              <Text className="text-red-500 text-base font-bold">- ₹1,890.00</Text>
            </View>
          </View>
          
          <View className="h-px bg-[#1b1b1c] mx-3" />

          {/* Transaction 5 */}
          <View className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-purple-900/40 rounded-full items-center justify-center mr-3">
                <Ionicons name="card-outline" size={20} color="#a855f7" />
              </View>
              <View>
                <Text className="text-white text-base font-bold">Online Subscription</Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
                  <Text className="text-gray-400 text-xs">Entertainment</Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs mb-1">Jun 8, 2025</Text>
              <Text className="text-red-500 text-base font-bold">- ₹499.00</Text>
            </View>
          </View>
          
          <View className="h-px bg-[#1b1b1c] mx-3" />

          {/* Transaction 6 */}
          <View className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-gray-800/80 rounded-full items-center justify-center mr-3">
                <Ionicons name="water-outline" size={20} color="white" />
              </View>
              <View>
                <Text className="text-white text-base font-bold">Fuel</Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
                  <Text className="text-gray-400 text-xs">Transport</Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs mb-1">Jun 7, 2025</Text>
              <Text className="text-red-500 text-base font-bold">- ₹1,200.00</Text>
            </View>
          </View>
          
          <View className="h-px bg-[#1b1b1c] mx-3" />

          {/* Transaction 7 */}
          <View className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-green-900/40 rounded-full items-center justify-center mr-3">
                <Ionicons name="gift-outline" size={20} color="#22c55e" />
              </View>
              <View>
                <Text className="text-white text-base font-bold">Gift Received</Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mr-1.5" />
                  <Text className="text-gray-400 text-xs">Income</Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs mb-1">Jun 6, 2025</Text>
              <Text className="text-green-500 text-base font-bold">+ ₹2,500.00</Text>
            </View>
          </View>

        </View>

        {/* May 2025 Section */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-base font-bold">May 2025</Text>
          <View className="flex-row items-center">
            <Text className="text-red-500 text-sm font-bold mr-1">- ₹4,320.00</Text>
            <Ionicons name="chevron-down" size={16} color="#ef4444" />
          </View>
        </View>

        {/* May 2025 Summary Card */}
        <View className="bg-[#0f1011] rounded-2xl p-4 flex-row justify-between mb-8 border border-[#1b1b1c]">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#12281a] rounded-full items-center justify-center mr-2">
              <Ionicons name="arrow-down-outline" size={18} color="#22c55e" />
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] mb-0.5">Total Income</Text>
              <Text className="text-green-500 text-xs font-bold">₹80,240.00</Text>
            </View>
          </View>

          <View className="w-px h-full bg-[#1b1b1c]" />

          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#2a1313] rounded-full items-center justify-center mr-2">
              <Ionicons name="arrow-up-outline" size={18} color="#ef4444" />
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] mb-0.5">Total Expense</Text>
              <Text className="text-red-500 text-xs font-bold">₹31,590.00</Text>
            </View>
          </View>

          <View className="w-px h-full bg-[#1b1b1c]" />

          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#1a1428] rounded-full items-center justify-center mr-2">
              <Ionicons name="trending-up-outline" size={18} color="#6642f8" />
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] mb-0.5">Net Balance</Text>
              <Text className="text-[#6642f8] text-xs font-bold">₹48,650.00</Text>
            </View>
          </View>
        </View>

        {/* Extra padding for tab bar mock */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
