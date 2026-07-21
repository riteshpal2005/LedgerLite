import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function AboutCard() {
  return (
    <>
      <Text className="text-white text-base font-bold mb-3">About</Text>
      <View className="bg-surface-base rounded-2xl p-2 mb-6 border border-card-base">
        
        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="information-circle-outline" size={20} color="#a855f7" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">About LedgerLite</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Version 1.0.0 • Build 100</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="h-px bg-card-base mx-3" />

        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="help-circle-outline" size={20} color="#a855f7" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Help & Support</Text>
              <Text className="text-gray-400 text-xs mt-0.5">FAQs, contact support</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

      </View>
    </>);

}