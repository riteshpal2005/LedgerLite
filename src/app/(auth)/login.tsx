import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      <View className="flex-1 px-6 justify-center pb-10">
        
        {}
        <View className="items-center mb-10">
          <Ionicons name="journal-outline" size={80} color="#6642f8" className="mb-4" />
          <Text className="text-white text-4xl font-bold mb-2">
            Ledger<Text className="text-[#6642f8]">Lite</Text>
          </Text>
          <Text className="text-gray-400 text-sm">Track. Manage. Grow.</Text>
        </View>

        {}
        <View className="items-center mb-8">
          <Text className="text-white text-2xl font-bold mb-2">Welcome Back!</Text>
          <Text className="text-gray-400 text-sm">Login to continue tracking your finances</Text>
        </View>

        {}
        <View className="mb-4">
          <View className="bg-[#0f1011] rounded-xl flex-row items-center p-4 border border-[#1b1b1c] mb-4">
            <Ionicons name="mail-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
              keyboardType="email-address"
              autoCapitalize="none" />
            
          </View>
          
          <View className="bg-[#0f1011] rounded-xl flex-row items-center p-4 border border-[#1b1b1c] mb-2">
            <Ionicons name="lock-closed-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
              secureTextEntry />
            
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity className="items-end mb-6">
            <Text className="text-[#6642f8] text-xs font-bold">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {}
        <TouchableOpacity className="bg-[#6642f8] rounded-xl p-4 items-center justify-center mb-8">
          <Text className="text-white text-lg font-bold">Login</Text>
        </TouchableOpacity>

        {}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-[#1b1b1c]" />
          <Text className="text-gray-500 text-xs mx-4 font-bold">OR</Text>
          <View className="flex-1 h-px bg-[#1b1b1c]" />
        </View>

        {}
        <View className="flex-row justify-between mb-10">
          <TouchableOpacity className="bg-[#0f1011] rounded-xl p-4 flex-row items-center justify-center flex-1 mr-2 border border-[#1b1b1c]">
            <Ionicons name="logo-google" size={18} color="#ea4335" className="mr-2" />
            <Text className="text-white text-xs font-bold">Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-[#0f1011] rounded-xl p-4 flex-row items-center justify-center flex-1 ml-2 border border-[#1b1b1c]">
            <Ionicons name="logo-apple" size={18} color="white" className="mr-2" />
            <Text className="text-white text-xs font-bold">Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        {}
        <View className="flex-row justify-center">
          <Text className="text-gray-400 text-sm mr-1">Don't have an account?</Text>
          <TouchableOpacity>
            <Text className="text-[#6642f8] text-sm font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>);

}