import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DeveloperScreen() {
  const router = useRouter();

  const screens = [
    { name: "Home (Tabs)", route: "/(tabs)" },
    { name: "Transactions", route: "/(tabs)/transactions" },
    { name: "Analytics", route: "/(tabs)/analytics" },
    { name: "Settings (More)", route: "/(tabs)/settings" },
    { name: "Add Transaction", route: "/add-transaction" },
    { name: "Splash Screen", route: "/splash" },
    { name: "Login (LockScreen)", route: "/signin" },
    { name: "Sign Up", route: "/signup" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      <View className="px-6 pt-10 pb-6 border-b border-[#1b1b1c]">
        <Text className="text-[#6642f8] text-3xl font-bold mb-2">Developer Menu</Text>
        <Text className="text-gray-400 text-sm">Quick navigation to all mocked screens for testing.</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {screens.map((screen, index) => (
          <TouchableOpacity
            key={index}
            className="w-full bg-[#0f1011] rounded-2xl p-5 mb-4 border border-[#1b1b1c] flex-row items-center justify-between"
            onPress={() => router.push(screen.route as any)}
          >
            <Text className="text-white text-lg font-bold">{screen.name}</Text>
            <Ionicons name="chevron-forward" size={24} color="#6642f8" />
          </TouchableOpacity>
        ))}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
