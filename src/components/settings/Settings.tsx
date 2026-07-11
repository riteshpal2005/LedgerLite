import { View, ScrollView, Pressable, Text } from "react-native";
import { Heading, Label } from "../../components/ui/Typography";
import { Card } from "../../components/ui/Card";
import { IconWrapper } from "../../components/ui/IconWrapper";
import { PreferencesSection } from "../../components/settings/PreferencesSection";
import { AccountsSection } from "../../components/settings/AccountsSection";
import { DataManagementSection } from "../../components/settings/DataManagementSection";
import { AdvancedSection } from "../../components/settings/AdvancedSection";
import { AccountSection } from "../../components/settings/AccountSection";
import { AboutSection } from "../../components/settings/AboutSection";
import { HelpSection } from "../../components/settings/HelpSection";
import { ManageCategoriesCard } from "../../components/categories/ManageCategoriesCard";
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
        <HelpSection />
        <AdvancedSection />
        <AboutSection />
        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
