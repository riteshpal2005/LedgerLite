import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle } from "react-native-svg";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mt-4 mb-2">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-[#8b5cf6] rounded-xl items-center justify-center mr-3">
            <Ionicons name="book" size={24} color="white" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">
              Ledger<Text className="text-[#8b5cf6]">Lite</Text>
            </Text>
            <Text className="text-gray-400 text-xs">Transaction Tracker</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>

        {/* Overview */}
        <View className="flex-row justify-between items-end mb-3">
          <Text className="text-white text-lg font-bold">Overview</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-gray-300 text-sm mr-1">This Month</Text>
            <Ionicons name="chevron-down" size={16} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        <View className="bg-[#0f1011] rounded-2xl p-5 mb-8">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-gray-400 text-sm">Total Balance</Text>
            <Ionicons name="eye-outline" size={24} color="#d1d5db" />
          </View>
          <Text className="text-white text-4xl font-bold mb-4">₹48,650.00</Text>
          
          <View className="h-px bg-[#1b1b1c] w-full mb-4" />
          
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-green-500 text-sm mb-1">Income</Text>
              <Text className="text-green-500 text-lg font-bold">₹80,240.00</Text>
            </View>
            <View className="w-px h-10 bg-[#1b1b1c] mx-4" />
            <View className="flex-1">
              <Text className="text-red-500 text-sm mb-1">Expense</Text>
              <Text className="text-white text-lg font-bold">₹31,590.00</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="flex-row justify-between items-end mb-3">
          <Text className="text-white text-lg font-bold">Recent Transactions</Text>
          <TouchableOpacity>
            <Text className="text-[#8b5cf6] text-sm font-bold">See all</Text>
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

        {/* Monthly Summary */}
        <Text className="text-white text-lg font-bold mb-4">Monthly Summary</Text>
        <View className="flex-row justify-between items-center mb-10 pl-2 pr-4">
          <View className="w-32 h-32 relative justify-center items-center">
             <Svg width="128" height="128" viewBox="0 0 160 160" style={{ transform: [{ rotate: '-90deg' }] }}>
               {/* Background Track */}
               <Circle 
                 cx="80" cy="80" r="70" 
                 stroke="#1b1b1c" 
                 strokeWidth="20" 
                 fill="none" 
               />
               
               {/* Income (Blue) - 72% */}
               <Circle
                 cx="80" cy="80" r="70"
                 stroke="#3b82f6"
                 strokeWidth="20"
                 fill="none"
                 strokeDasharray="316 440"
                 strokeDashoffset="0"
                 strokeLinecap="round"
               />
               
               {/* Expense (Purple) - 28% */}
               <Circle
                 cx="80" cy="80" r="70"
                 stroke="#8b5cf6"
                 strokeWidth="20"
                 fill="none"
                 strokeDasharray="124 440"
                 strokeDashoffset="-316"
                 strokeLinecap="round"
               />
             </Svg>
          </View>
          
          <View className="justify-center flex-1 ml-6">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-gray-400 text-sm">Income</Text>
              <Text className="text-green-500 text-base font-bold">₹80,240.00</Text>
            </View>
            
            <View className="h-px bg-[#1b1b1c] my-3 w-full" />
            
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-gray-400 text-sm">Expense</Text>
              <Text className="text-red-500 text-base font-bold">₹31,590.00</Text>
            </View>
          </View>
        </View>
        
        {/* Extra padding for tab bar mock */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
