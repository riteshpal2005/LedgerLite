import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function InsightsHeroCard() {
  return (
    <View className="mx-6 mb-8 rounded-2xl bg-surface-base border border-card-base p-5 flex-row items-center justify-between overflow-hidden relative">
      
      {}
      <View className="absolute right-0 top-0 bottom-0 w-32 bg-brand-primary/5 opacity-50" />

      <View className="flex-row items-center flex-1 pr-4 z-10">
        <View className="w-12 h-12 rounded-full bg-card-base items-center justify-center mr-4 shadow-sm border border-zinc-800">
          <Ionicons name="sparkles" size={20} color="#6642f8" />
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold text-base mb-1">Your financial insights</Text>
          <Text className="text-gray-400 text-xs leading-relaxed">
            AI-powered analysis of your spending patterns and habits.
          </Text>
        </View>
      </View>

      {}
      <View className="w-20 h-16 justify-end flex-row items-end space-x-1.5 z-10 opacity-70">
        <View className="w-3 bg-brand-primary/40 rounded-t-sm h-6" />
        <View className="w-3 bg-brand-primary/60 rounded-t-sm h-10" />
        <View className="w-3 bg-brand-primary/80 rounded-t-sm h-8" />
        <View className="w-3 bg-brand-primary rounded-t-sm h-12" />
        
        {}
        <View className="absolute top-2 left-0 right-0 h-10">
          <View className="absolute top-4 left-1 w-2 h-2 rounded-full bg-white opacity-40 z-20" />
          <View className="absolute top-1 left-7 w-2 h-2 rounded-full bg-white opacity-40 z-20" />
          <View className="absolute top-6 left-13 w-2 h-2 rounded-full bg-white opacity-40 z-20" />
          <View className="absolute top-3 left-19 w-2 h-2 rounded-full bg-brand-primary z-20" />
        </View>
      </View>
    </View>);

}