import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <ScrollView className="flex-1 px-6 pt-10" showsVerticalScrollIndicator={false}>
        
        {}
        <View className="items-center mb-10">
          <Ionicons name="journal-outline" size={80} color="#6642f8" className="mb-4" />
          <Text className="text-white text-4xl font-bold mb-2">
            Ledger<Text className="text-brand-primary">Lite</Text>
          </Text>
          <Text className="text-gray-400 text-sm">Track. Manage. Grow.</Text>
        </View>

        {}
        <View className="items-center mb-8">
          <Text className="text-white text-2xl font-bold mb-2">Create Account</Text>
          <Text className="text-gray-400 text-sm">Start tracking your finances today</Text>
        </View>

        {}
        <View className="mb-4">
          <View className="bg-surface-base rounded-xl flex-row items-center p-4 border border-card-base mb-4">
            <Ionicons name="person-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base" />
            
          </View>

          <View className="bg-surface-base rounded-xl flex-row items-center p-4 border border-card-base mb-4">
            <Ionicons name="mail-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
              keyboardType="email-address"
              autoCapitalize="none" />
            
          </View>
          
          <View className="bg-surface-base rounded-xl flex-row items-center p-4 border border-card-base mb-4">
            <Ionicons name="lock-closed-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Create Password"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
              secureTextEntry />
            
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View className="bg-surface-base rounded-xl flex-row items-center p-4 border border-card-base mb-6">
            <Ionicons name="lock-closed-outline" size={20} color="#6642f8" className="mr-3" />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
              secureTextEntry />
            
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          {}
          <View className="flex-row items-center mb-6 px-1">
            <TouchableOpacity className="mr-3">
              <Ionicons name="square-outline" size={20} color="#6642f8" />
            </TouchableOpacity>
            <Text className="text-gray-400 text-xs flex-1">
              I agree to the <Text className="text-brand-primary">Terms of Service</Text> and <Text className="text-brand-primary">Privacy Policy</Text>
            </Text>
          </View>
        </View>

        {}
        <TouchableOpacity className="bg-brand-primary rounded-xl p-4 items-center justify-center mb-8">
          <Text className="text-white text-lg font-bold">Sign Up</Text>
        </TouchableOpacity>

        {}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-card-base" />
          <Text className="text-gray-500 text-xs mx-4 font-bold">OR</Text>
          <View className="flex-1 h-px bg-card-base" />
        </View>

        {}
        <View className="flex-row justify-between mb-10">
          <TouchableOpacity className="bg-surface-base rounded-xl p-4 flex-row items-center justify-center flex-1 mr-2 border border-card-base">
            <Ionicons name="logo-google" size={18} color="#ea4335" className="mr-2" />
            <Text className="text-white text-xs font-bold">Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-surface-base rounded-xl p-4 flex-row items-center justify-center flex-1 ml-2 border border-card-base">
            <Ionicons name="logo-apple" size={18} color="white" className="mr-2" />
            <Text className="text-white text-xs font-bold">Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        {}
        <View className="flex-row justify-center pb-10">
          <Text className="text-gray-400 text-sm mr-1">Already have an account?</Text>
          <TouchableOpacity>
            <Text className="text-brand-primary text-sm font-bold">Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>);

}