import { View, Text, ScrollView, Pressable } from "react-native";
import { PreferencesSection } from "../../features/settings/components/PreferencesSection";
import { AccountsSection } from "../../features/settings/components/AccountsSection";
import { DataManagementSection } from "../../features/settings/components/DataManagementSection";
import { AdvancedSection } from "../../features/settings/components/AdvancedSection";
import { AccountSection } from "../../features/settings/components/AccountSection";
import { AboutSection } from "../../features/settings/components/AboutSection";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-background p-6 pt-12">
      <Text className="text-3xl font-bold text-primary mb-8">Settings</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        <AccountSection />
        
        <View className="mb-8">
          <Text className="text-secondary font-bold uppercase text-xs tracking-wider mb-2">Customization</Text>
          <Pressable 
            onPress={() => router.push('/categories')}
            className="bg-surface rounded-2xl p-4 border border-bordercolor flex-row justify-between items-center"
          >
            <View className="flex-row items-center">
              <View className="bg-blue-500/20 w-10 h-10 rounded-full items-center justify-center mr-3">
                <Ionicons name="pricetags" size={20} color="#3b82f6" />
              </View>
              <Text className="text-primary text-lg font-semibold">Manage Categories</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#71717a" />
          </Pressable>
        </View>

        <PreferencesSection />
        <AccountsSection />
        <DataManagementSection />
        <AdvancedSection />
        <AboutSection />
        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
