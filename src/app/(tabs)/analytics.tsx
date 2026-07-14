import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, G } from "react-native-svg";

export default function AnalyticsScreen() {
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
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="calendar-outline" size={20} color="white" className="mr-1" />
          <Text className="text-gray-200 ml-1">This Month</Text>
          <Ionicons name="chevron-down" size={16} color="white" className="ml-1" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-white text-2xl font-bold mb-4">Analytics</Text>

        {/* Filter Tabs */}
        <View className="flex-row bg-[#0f1011] rounded-xl p-1 mb-6">
          <TouchableOpacity className="flex-1 items-center justify-center py-2 bg-[#1b1b1c] rounded-lg border border-[#6642f8]/30">
            <Text className="text-[#6642f8] font-bold text-xs">Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center justify-center py-2">
            <Text className="text-green-500 font-bold text-xs">Income</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center justify-center py-2">
            <Text className="text-red-500 font-bold text-xs">Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center justify-center py-2">
            <Text className="text-gray-400 font-bold text-xs">Categories</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View className="flex-row justify-between mb-6">
          {/* Total Income */}
          <View className="bg-[#0f1011] p-3 rounded-2xl flex-1 mr-2 border border-[#1b1b1c]">
            <View className="w-8 h-8 bg-[#12281a] rounded-full items-center justify-center mb-2">
              <Ionicons name="arrow-down-outline" size={16} color="#22c55e" />
            </View>
            <Text className="text-gray-400 text-xs mb-1">Total Income</Text>
            <Text className="text-green-500 text-base font-bold mb-1">₹80,240.00</Text>
            <View className="flex-row items-center">
              <Ionicons name="arrow-up-outline" size={10} color="#22c55e" />
              <Text className="text-green-500 text-[10px] ml-0.5 mr-1">12.5%</Text>
              <Text className="text-gray-500 text-[9px]">vs last month</Text>
            </View>
          </View>

          {/* Total Expense */}
          <View className="bg-[#0f1011] p-3 rounded-2xl flex-1 mr-2 border border-[#1b1b1c]">
            <View className="w-8 h-8 bg-[#2a1313] rounded-full items-center justify-center mb-2">
              <Ionicons name="arrow-up-outline" size={16} color="#ef4444" />
            </View>
            <Text className="text-gray-400 text-xs mb-1">Total Expense</Text>
            <Text className="text-red-500 text-base font-bold mb-1">₹31,590.00</Text>
            <View className="flex-row items-center">
              <Ionicons name="arrow-up-outline" size={10} color="#ef4444" />
              <Text className="text-red-500 text-[10px] ml-0.5 mr-1">8.3%</Text>
              <Text className="text-gray-500 text-[9px]">vs last month</Text>
            </View>
          </View>

          {/* Net Balance */}
          <View className="bg-[#0f1011] p-3 rounded-2xl flex-1 border border-[#1b1b1c]">
            <View className="w-8 h-8 bg-[#1a1428] rounded-full items-center justify-center mb-2">
              <Ionicons name="trending-up-outline" size={16} color="#6642f8" />
            </View>
            <Text className="text-gray-400 text-xs mb-1">Net Balance</Text>
            <Text className="text-[#6642f8] text-base font-bold mb-1">₹48,650.00</Text>
            <View className="flex-row items-center">
              <Ionicons name="arrow-up-outline" size={10} color="#6642f8" />
              <Text className="text-[#6642f8] text-[10px] ml-0.5 mr-1">15.2%</Text>
              <Text className="text-gray-500 text-[9px]">vs last month</Text>
            </View>
          </View>
        </View>

        {/* Cash Flow Trend Line Chart */}
        <View className="bg-[#0f1011] rounded-2xl p-4 mb-6 border border-[#1b1b1c]">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-base font-bold">Cash Flow Trend</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-400 text-xs mr-1">This Month</Text>
              <Ionicons name="chevron-down" size={12} color="#d1d5db" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-4">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
              <Text className="text-gray-400 text-xs">Income</Text>
            </View>
            <View className="flex-row items-center mr-4">
              <View className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
              <Text className="text-gray-400 text-xs">Expense</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-[#6642f8] mr-1.5" />
              <Text className="text-gray-400 text-xs">Net</Text>
            </View>
          </View>

          {/* SVG Chart Area */}
          <View className="h-40 relative flex-row">
            {/* Y-Axis */}
            <View className="w-10 justify-between items-end pb-5 pr-2">
              <Text className="text-gray-500 text-[10px]">₹100K</Text>
              <Text className="text-gray-500 text-[10px]">₹75K</Text>
              <Text className="text-gray-500 text-[10px]">₹50K</Text>
              <Text className="text-gray-500 text-[10px]">₹25K</Text>
              <Text className="text-gray-500 text-[10px]">₹0</Text>
            </View>

            <View className="flex-1">
              {/* Horizontal Grid Lines */}
              <View className="absolute w-full h-full justify-between pb-5">
                <View className="w-full h-px bg-[#1b1b1c] border-dashed border-[#1b1b1c]" style={{borderWidth: 0.5, borderStyle: 'dashed'}}/>
                <View className="w-full h-px bg-[#1b1b1c] border-dashed border-[#1b1b1c]" style={{borderWidth: 0.5, borderStyle: 'dashed'}}/>
                <View className="w-full h-px bg-[#1b1b1c] border-dashed border-[#1b1b1c]" style={{borderWidth: 0.5, borderStyle: 'dashed'}}/>
                <View className="w-full h-px bg-[#1b1b1c] border-dashed border-[#1b1b1c]" style={{borderWidth: 0.5, borderStyle: 'dashed'}}/>
                <View className="w-full h-px bg-[#1b1b1c] border-dashed border-[#1b1b1c]" style={{borderWidth: 0.5, borderStyle: 'dashed'}}/>
              </View>

              {/* Lines */}
              <View className="absolute w-full h-full pb-5">
                <Svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none">
                  {/* Income Line (Green) */}
                  <Path
                    d="M 0 100 Q 20 85 40 85 T 80 80 T 120 50 T 160 55 T 200 30 T 240 40 T 280 20 L 300 10"
                    stroke="#22c55e"
                    strokeWidth="3"
                    fill="none"
                  />
                  <Circle cx="300" cy="10" r="4" fill="#22c55e" />

                  {/* Net Balance Line (Purple) */}
                  <Path
                    d="M 0 110 Q 20 100 40 100 T 80 90 T 120 70 T 160 80 T 200 65 T 240 75 T 280 60 L 300 50"
                    stroke="#6642f8"
                    strokeWidth="3"
                    fill="none"
                  />
                  <Circle cx="300" cy="50" r="4" fill="#6642f8" />

                  {/* Expense Line (Red) */}
                  <Path
                    d="M 0 115 Q 20 110 40 110 T 80 105 T 120 95 T 160 100 T 200 90 T 240 95 T 280 85 L 300 80"
                    stroke="#ef4444"
                    strokeWidth="3"
                    fill="none"
                  />
                  <Circle cx="300" cy="80" r="4" fill="#ef4444" />
                </Svg>
              </View>

              {/* X-Axis */}
              <View className="absolute bottom-0 w-full flex-row justify-between pr-2">
                <Text className="text-gray-500 text-[10px]">1 Jun</Text>
                <Text className="text-gray-500 text-[10px]">8 Jun</Text>
                <Text className="text-gray-500 text-[10px]">15 Jun</Text>
                <Text className="text-gray-500 text-[10px]">22 Jun</Text>
                <Text className="text-gray-500 text-[10px]">30 Jun</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spending by Category Donut Chart */}
        <View className="bg-[#0f1011] rounded-2xl p-4 mb-6 border border-[#1b1b1c]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-base font-bold">Spending by Category</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-400 text-xs mr-1">This Month</Text>
              <Ionicons name="chevron-down" size={12} color="#d1d5db" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            {/* Donut Chart */}
            <View className="w-[140px] h-[140px] relative justify-center items-center">
              <Svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: [{ rotate: '-90deg' }] }}>
                {/* Food (Red) - 35.6% */}
                <Circle cx="60" cy="60" r="45" stroke="#ef4444" strokeWidth="16" fill="none"
                  strokeDasharray="100 282" strokeDashoffset="0" />
                {/* Transport (Blue) - 19.6% */}
                <Circle cx="60" cy="60" r="45" stroke="#3b82f6" strokeWidth="16" fill="none"
                  strokeDasharray="55 282" strokeDashoffset="-100" />
                {/* Utilities (Yellow) - 12.3% */}
                <Circle cx="60" cy="60" r="45" stroke="#eab308" strokeWidth="16" fill="none"
                  strokeDasharray="35 282" strokeDashoffset="-155" />
                {/* Entertainment (Purple) - 9.5% */}
                <Circle cx="60" cy="60" r="45" stroke="#a855f7" strokeWidth="16" fill="none"
                  strokeDasharray="27 282" strokeDashoffset="-190" />
                {/* Others (Teal/Green) - 22.9% */}
                <Circle cx="60" cy="60" r="45" stroke="#14b8a6" strokeWidth="16" fill="none"
                  strokeDasharray="65 282" strokeDashoffset="-217" />
              </Svg>
              <View className="absolute items-center justify-center">
                <Text className="text-white font-bold text-sm">₹31,590.00</Text>
                <Text className="text-gray-400 text-[10px]">Total Expense</Text>
              </View>
            </View>

            {/* Legend List */}
            <View className="flex-1 ml-4">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="w-5 h-5 bg-red-500 rounded-full items-center justify-center mr-2">
                    <Ionicons name="cart-outline" size={10} color="white" />
                  </View>
                  <Text className="text-gray-300 text-xs">Food & Groceries</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-white text-xs mr-2">₹11,250</Text>
                  <Text className="text-gray-500 text-[10px] mt-0.5">35.6%</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="w-5 h-5 bg-blue-500 rounded-full items-center justify-center mr-2">
                    <Ionicons name="car-outline" size={10} color="white" />
                  </View>
                  <Text className="text-gray-300 text-xs">Transport</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-white text-xs mr-2">₹6,200</Text>
                  <Text className="text-gray-500 text-[10px] mt-0.5">19.6%</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="w-5 h-5 bg-yellow-500 rounded-full items-center justify-center mr-2">
                    <Ionicons name="flash-outline" size={10} color="white" />
                  </View>
                  <Text className="text-gray-300 text-xs">Utilities</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-white text-xs mr-2">₹3,890</Text>
                  <Text className="text-gray-500 text-[10px] mt-0.5">12.3%</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="w-5 h-5 bg-purple-500 rounded-full items-center justify-center mr-2">
                    <Ionicons name="card-outline" size={10} color="white" />
                  </View>
                  <Text className="text-gray-300 text-xs">Entertainment</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-white text-xs mr-2">₹2,990</Text>
                  <Text className="text-gray-500 text-[10px] mt-0.5">9.5%</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-5 h-5 bg-teal-500 rounded-full items-center justify-center mr-2">
                    <Ionicons name="ellipsis-horizontal-outline" size={10} color="white" />
                  </View>
                  <Text className="text-gray-300 text-xs">Others</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-white text-xs mr-2">₹7,260</Text>
                  <Text className="text-gray-500 text-[10px] mt-0.5">22.9%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View className="bg-[#0f1011] rounded-2xl p-4 mb-6 border border-[#1b1b1c] flex-row items-center">
          <Ionicons name="bulb-outline" size={24} color="#6642f8" className="mr-3" />
          <View className="flex-1 mr-2 pl-3">
            <Text className="text-white font-bold mb-1">Insights</Text>
            <Text className="text-gray-400 text-xs leading-5">
              You spent <Text className="text-white font-bold">12.5% less</Text> on Food & Groceries compared to last month.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </View>

        {/* Extra padding for tab bar mock */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
