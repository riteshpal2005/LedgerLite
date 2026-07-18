import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCurrency } from "../../hooks/useCurrency";

export function ToolsAndSettings() {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [appearance, setAppearance] = useState<"System" | "Light" | "Dark">("Dark");
  const [isAppearanceDropdownOpen, setIsAppearanceDropdownOpen] = useState(false);
  const router = useRouter();
  const { currencyConfig } = useCurrency();

  return (
    <>
      <Text className="text-white text-base font-bold mb-3">Tools & Settings</Text>
      <View className="bg-[#0f1011] rounded-2xl p-2 mb-6 border border-[#1b1b1c] z-50">
        
        <View className="relative z-50">
          <TouchableOpacity 
            className="flex-row justify-between items-center p-3"
            onPress={() => setIsAppearanceDropdownOpen(!isAppearanceDropdownOpen)}
          >
            <View className="flex-row items-center">
              <Ionicons name="color-palette-outline" size={20} color="#a855f7" className="mr-4" />
              <View>
                <Text className="text-white text-sm font-bold">App Appearance</Text>
                <Text className="text-gray-400 text-xs mt-0.5">{appearance}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Ionicons name={isAppearanceDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          {isAppearanceDropdownOpen && (
            <View className="absolute top-full right-3 mt-1 bg-[#18181b] w-40 rounded-2xl border border-[#27272a] overflow-hidden shadow-2xl z-50">
              {(["System", "Light", "Dark"] as const).map((item, index) => (
                <TouchableOpacity
                  key={item}
                  className={`px-4 py-3 ${index !== 2 ? 'border-b border-[#27272a]' : ''} ${appearance === item ? 'bg-[#a855f7]/10' : ''}`}
                  onPress={() => { setAppearance(item); setIsAppearanceDropdownOpen(false); }}
                >
                  <Text className={`text-sm ${appearance === item ? 'text-[#a855f7] font-bold' : 'text-gray-300'}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <View className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="phone-portrait-outline" size={20} color="#22c55e" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Haptics</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Vibration feedback</Text>
            </View>
          </View>
          <Switch 
            value={hapticsEnabled}
            onValueChange={setHapticsEnabled}
            trackColor={{ false: '#3e3e3e', true: '#6642f8' }}
            thumbColor={'#ffffff'}
          />
        </View>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <TouchableOpacity 
          className="flex-row justify-between items-center p-3"
          onPress={() => router.push("/settings/currency")}
        >
          <View className="flex-row items-center">
            <Ionicons name="logo-usd" size={20} color="#f97316" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Currency</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{currencyConfig.name} ({currencyConfig.code})</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="cloud-upload-outline" size={20} color="#3b82f6" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Backup & Export</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Export or backup your data</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="trash-outline" size={20} color="#ef4444" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Clear All Data</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Delete all transactions & settings</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="h-px bg-[#1b1b1c] mx-3" />

        <TouchableOpacity className="flex-row justify-between items-center p-3">
          <View className="flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color="#a855f7" className="mr-4" />
            <View>
              <Text className="text-white text-sm font-bold">Privacy & Security</Text>
              <Text className="text-gray-400 text-xs mt-0.5">App lock, sensitive data</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

      </View>
    </>
  );
}
