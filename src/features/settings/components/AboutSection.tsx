import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';

// TODO: Replace these with your actual GitHub username and Hosted Policy URLs
const GITHUB_URL = "https://github.com/riteshpal2005/LedgerLite";
const PRIVACY_POLICY_URL = "https://riteshpal2005.github.io/privacy.html";
const TOS_URL = "https://riteshpal2005.github.io/terms.html";

export function AboutSection() {
  const handleOpenURL = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  return (
    <View className="mb-8 mt-6">
      <Text className="text-secondary font-bold uppercase text-xs tracking-wider mb-2">About & Legal</Text>
      
      <View className="bg-surface rounded-2xl border border-bordercolor overflow-hidden">
        
        {/* App Info */}
        <View className="p-4 border-b border-bordercolor flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="bg-blue-600 w-10 h-10 rounded-xl items-center justify-center mr-3 shadow-sm">
              <Ionicons name="wallet" size={20} color="white" />
            </View>
            <View>
              <Text className="text-primary text-lg font-bold">LedgerLite</Text>
              <Text className="text-secondary text-xs">v1.2.0 • Offline-First Finance</Text>
            </View>
          </View>
        </View>

        {/* Developer Credit */}
        <Pressable 
          onPress={() => handleOpenURL(GITHUB_URL)}
          className="p-4 border-b border-bordercolor flex-row items-center justify-between bg-white/5 active:bg-white/10"
        >
          <View className="flex-row items-center">
            <Ionicons name="code-slash" size={20} color="#10b981" />
            <Text className="text-primary font-medium ml-3">Developer</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-secondary mr-2">Ritesh Pal</Text>
            <Ionicons name="open-outline" size={16} color="#71717a" />
          </View>
        </Pressable>

        {/* GitHub Link */}
        <Pressable 
          onPress={() => handleOpenURL(GITHUB_URL)}
          className="p-4 border-b border-bordercolor flex-row items-center justify-between active:bg-white/10"
        >
          <View className="flex-row items-center">
            <Ionicons name="logo-github" size={20} color="#a855f7" />
            <Text className="text-primary font-medium ml-3">Source Code</Text>
          </View>
          <Ionicons name="open-outline" size={18} color="#71717a" />
        </Pressable>

        {/* Privacy Policy */}
        <Pressable 
          onPress={() => handleOpenURL(PRIVACY_POLICY_URL)}
          className="p-4 border-b border-bordercolor flex-row items-center justify-between active:bg-white/10"
        >
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
            <Text className="text-primary font-medium ml-3">Privacy Policy</Text>
          </View>
          <Ionicons name="open-outline" size={18} color="#71717a" />
        </Pressable>

        {/* Terms of Service */}
        <Pressable 
          onPress={() => handleOpenURL(TOS_URL)}
          className="p-4 flex-row items-center justify-between active:bg-white/10"
        >
          <View className="flex-row items-center">
            <Ionicons name="document-text" size={20} color="#f59e0b" />
            <Text className="text-primary font-medium ml-3">Terms of Service</Text>
          </View>
          <Ionicons name="open-outline" size={18} color="#71717a" />
        </Pressable>

      </View>
    </View>
  );
}
