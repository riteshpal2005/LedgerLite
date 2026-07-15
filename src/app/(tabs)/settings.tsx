import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 mt-4 mb-6">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-[#6642f8] rounded-xl items-center justify-center mr-3">
            <Ionicons name="book" size={24} color="white" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">
              Ledger<Text className="text-[#6642f8]">Lite</Text>
            </Text>
            <Text className="text-gray-400 text-xs">Transaction Tracker</Text>
          </View>
        </View>
        <TouchableOpacity className="relative">
          <Ionicons name="notifications-outline" size={24} color="white" />
          <View className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-4 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-[#6642f8] rounded-full items-center justify-center mr-4">
              <Text className="text-white text-2xl font-bold">R</Text>
            </View>
            <View>
              <Text className="text-white text-lg font-bold">Ritesh Pal</Text>
              <Text className="text-gray-400 text-sm mt-0.5">Manage your account</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text className="text-white text-base font-bold mb-3">Quick Actions</Text>
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity className="bg-[#0f1011] py-4 px-2 rounded-2xl flex-1 items-center justify-center mr-2 border border-[#1b1b1c]">
            <View className="w-10 h-10 rounded-full border border-purple-500/30 items-center justify-center mb-2">
              <Ionicons name="add" size={20} color="#a855f7" />
            </View>
            <Text className="text-gray-300 text-[10px] text-center">Add Transaction</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#0f1011] py-4 px-2 rounded-2xl flex-1 items-center justify-center mr-2 border border-[#1b1b1c]">
            <View className="w-10 h-10 rounded-full border border-blue-500/30 items-center justify-center mb-2">
              <Ionicons name="document-text-outline" size={18} color="#3b82f6" />
            </View>
            <Text className="text-gray-300 text-[10px] text-center">Add Category</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#0f1011] py-4 px-2 rounded-2xl flex-1 items-center justify-center mr-2 border border-[#1b1b1c]">
            <View className="w-10 h-10 rounded-full border border-green-500/30 items-center justify-center mb-2">
              <Ionicons name="download-outline" size={18} color="#22c55e" />
            </View>
            <Text className="text-gray-300 text-[10px] text-center">Export Data</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#0f1011] py-4 px-2 rounded-2xl flex-1 items-center justify-center border border-[#1b1b1c]">
            <View className="w-10 h-10 rounded-full border border-purple-500/30 items-center justify-center mb-2">
              <Ionicons name="pie-chart-outline" size={18} color="#a855f7" />
            </View>
            <Text className="text-gray-300 text-[10px] text-center">Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Accounts */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-base font-bold">Accounts</Text>
          <TouchableOpacity>
            <Text className="text-[#6642f8] text-sm font-bold">Manage {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-[#0f1011] rounded-2xl p-2 mb-8 border border-[#1b1b1c]">
          {/* Bank Account */}
          <TouchableOpacity className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-900/30 rounded-full items-center justify-center mr-3">
                <Ionicons name="business-outline" size={18} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-white text-sm font-bold">Bank Account</Text>
                <Text className="text-gray-400 text-xs mt-0.5">SBI •••• 4567</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-green-500 text-sm font-bold mr-2">₹2,000.00</Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Tools & Settings */}
        <Text className="text-white text-base font-bold mb-3">Tools & Settings</Text>
        <View className="bg-[#0f1011] rounded-2xl p-2 mb-6 border border-[#1b1b1c]">
          
          <TouchableOpacity className="flex-row justify-between items-center p-3">
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

        {/* About */}
        <View className="bg-[#0f1011] rounded-2xl p-2 mb-6 border border-[#1b1b1c]">
          <TouchableOpacity className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={20} color="#9ca3af" className="mr-4" />
              <View>
                <Text className="text-white text-sm font-bold">About LedgerLite</Text>
                <Text className="text-gray-400 text-xs mt-0.5">Version 1.0.0</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Extra padding for tab bar mock */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
