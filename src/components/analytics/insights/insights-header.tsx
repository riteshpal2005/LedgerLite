import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function InsightsHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between mb-6 px-6 pt-2">
      <View className="flex-row items-center flex-1">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#1b1b1c] items-center justify-center mr-4 active:opacity-70"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-[#6642f8]/10 items-center justify-center mr-3">
            <Ionicons name="bulb-outline" size={20} color="#6642f8" />
          </View>
          <View>
            <Text className="text-white font-bold text-lg leading-tight">Insights</Text>
            <Text className="text-gray-400 text-[10px] leading-tight mt-0.5">Smart insights based on your transactions</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity className="flex-row items-center bg-[#131415] border border-[#27272a] rounded-xl px-3 py-1.5 active:opacity-70">
        <Ionicons name="calendar-outline" size={14} color="#a1a1aa" className="mr-1.5" />
        <Text className="text-white text-xs font-medium mr-1">This Month</Text>
        <Ionicons name="chevron-down" size={14} color="#a1a1aa" />
      </TouchableOpacity>
    </View>
  );
}
