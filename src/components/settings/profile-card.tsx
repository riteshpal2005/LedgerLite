import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../server/firebase/AuthContext";

export function ProfileCard() {
  const { user } = useAuth();

  const displayName = user?.displayName || user?.email || "Guest User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-4 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
      <View className="flex-row items-center">
        <View className="w-14 h-14 bg-[#6642f8] rounded-full items-center justify-center mr-4">
          <Text className="text-white text-2xl font-bold">{initial}</Text>
        </View>
        <View>
          <Text className="text-white text-lg font-bold">{displayName}</Text>
          <View className="flex-row items-center mt-1">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
            <Text className="text-gray-400 text-xs">Offline Mode</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
}
