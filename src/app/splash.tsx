import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SplashScreenMock() {
  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <View className="flex-1 px-6 items-center justify-center">
        {}
        <Ionicons name="journal" size={90} color="#6642f8" className="mb-6" />
        <Text className="text-white text-5xl font-bold mb-3 tracking-tight">
          Ledger<Text className="text-brand-primary">Lite</Text>
        </Text>
        <Text className="text-gray-400 text-base">Track. Manage. Grow.</Text>
      </View>
      
      {}
      <View className="pb-16 items-center">
        <ActivityIndicator size="large" color="#6642f8" />
      </View>
    </SafeAreaView>);

}