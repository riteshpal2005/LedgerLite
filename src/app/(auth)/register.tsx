import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      <ScrollView className="flex-1 px-6 pt-10" showsVerticalScrollIndicator={false}>
        
        {/* App Logo & Branding */}
        <View className="items-center mb-10">
          <Ionicons name="journal-outline" size={80} color="#6642f8" className="mb-4" />
          <Text className="text-white text-4xl font-bold mb-2">
            Ledger<Text className="text-[#6642f8]">Lite</Text>
          </Text>
          <Text className="text-gray-400 text-sm">Track. Manage. Grow.</Text>
        </View>

        {/* Welcome Text */}
        <View className="items-center mb-8">
          <Text className="text-white text-2xl font-bold mb-2">Create Account</Text>
          <Text className="text-gray-400 text-sm">Start tracking your finances today</Text>
        </View>

        {/* Input Fields */}
        <View className="mb-4">
          <View className="bg-[#0f1011] rounded-xl flex-row items-center p-4 border border-[#1b1b1c] mb-4">
            <Ionicons name="person-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
            />
          </View>

          <View className="bg-[#0f1011] rounded-xl flex-row items-center p-4 border border-[#1b1b1c] mb-4">
            <Ionicons name="mail-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View className="bg-[#0f1011] rounded-xl flex-row items-center p-4 border border-[#1b1b1c] mb-4">
            <Ionicons name="lock-closed-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Create Password"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
              secureTextEntry
            />
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View className="bg-[#0f1011] rounded-xl flex-row items-center p-4 border border-[#1b1b1c] mb-6">
            <Ionicons name="lock-closed-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
              secureTextEntry
            />
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          {/* Terms */}
          <View className="flex-row items-center mb-6 px-1">
            <TouchableOpacity className="mr-3">
              <Ionicons name="square-outline" size={20} color="#6642f8" />
            </TouchableOpacity>
            <Text className="text-gray-400 text-xs flex-1">
              I agree to the <Text className="text-[#6642f8]">Terms of Service</Text> and <Text className="text-[#6642f8]">Privacy Policy</Text>
            </Text>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity className="bg-[#6642f8] rounded-xl p-4 items-center justify-center mb-8">
          <Text className="text-white text-lg font-bold">Sign Up</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-[#1b1b1c]" />
          <Text className="text-gray-500 text-xs mx-4 font-bold">OR</Text>
          <View className="flex-1 h-px bg-[#1b1b1c]" />
        </View>

        {/* Social Logins */}
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

        {/* Login Link */}
        <View className="flex-row justify-center pb-10">
          <Text className="text-gray-400 text-sm mr-1">Already have an account?</Text>
          <TouchableOpacity>
            <Text className="text-[#6642f8] text-sm font-bold">Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
