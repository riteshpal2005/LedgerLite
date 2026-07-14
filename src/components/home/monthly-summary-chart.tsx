import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

// Ref: MonthlySummaryChart-1
export function MonthlySummaryChart() {
  return (
    <View>
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
                stroke="#6642f8"
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
    </View>
  );
}
