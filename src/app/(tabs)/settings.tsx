import { View, ScrollView, Pressable, Text } from "react-native";
import { Heading, Label } from "../../shared/components/ui/Typography";
import { Card } from "../../shared/components/ui/Card";
import { IconWrapper } from "../../shared/components/ui/IconWrapper";
import { PreferencesSection } from "../../features/settings/components/PreferencesSection";
import { AccountsSection } from "../../features/settings/components/AccountsSection";
import { DataManagementSection } from "../../features/settings/components/DataManagementSection";
import { AdvancedSection } from "../../features/settings/components/AdvancedSection";
import { AccountSection } from "../../features/settings/components/AccountSection";
import { AboutSection } from "../../features/settings/components/AboutSection";
import { ManageCategoriesCard } from "../../features/categories/components/ManageCategoriesCard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-background p-6 pt-12">
      <Heading className="text-3xl mb-8">Settings</Heading>
      
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        <AccountSection />
        
        <ManageCategoriesCard />

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
