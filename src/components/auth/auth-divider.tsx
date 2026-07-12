import React from "react";
import { View, Text } from "react-native";

interface AuthDividerProps {
  isDark: boolean;
  text?: string;
}

export function AuthDivider({ isDark, text = "OR" }: AuthDividerProps) {
  return (
    <View className="flex-row items-center my-8">
      <View className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
      <Text className={`px-4 text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        {text}
      </Text>
      <View className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
    </View>
  );
}
