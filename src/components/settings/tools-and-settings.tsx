import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function ToolsAndSettings() {
  const router = useRouter();

  return (
    <>
      <Text className="text-white text-base font-bold mb-3">Tools & Settings</Text>
      <View className="bg-[#0f1011] rounded-2xl p-2 mb-6 border border-[#1b1b1c]">
        
        <TouchableOpacity 
          onPress={() => router.push("/categories")}
          className="flex-row justify-between items-center p-3"
        >
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark-outline" size={20} color="#3b82f6" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Categories</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Manage your categories</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="locate-outline" size={20} color="#a855f7" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Budget</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Set monthly budget</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="pricetag-outline" size={20} color="#f97316" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Tags</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Manage tags</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="cloud-outline" size={20} color="#14b8a6" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Backup & Sync</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Export, Import, Backup</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="settings-outline" size={20} color="#9ca3af" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">App Settings</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Preferences, Currency, Theme</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="help-circle-outline" size={20} color="#a855f7" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Help & Support</Text>
              <Text className="text-gray-400 text-xs mt-0.5">FAQs, Contact Support</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

      </View>
    </>
  );
}
