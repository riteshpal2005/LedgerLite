import { View, ScrollView, Pressable, Text } from "react-native";
import { Heading, Label } from "../../components/ui/typography";
import { Card } from "../../components/ui/card";
import { IconWrapper } from "../../components/ui/icon-wrapper";
import { PreferencesSection } from "../../components/settings/preferences-section";
import { AccountsSection } from "../../components/settings/accounts-section";
import { DataManagementSection } from "../../components/settings/data-management-section";
import { AdvancedSection } from "../../components/settings/advanced-section";
import { AccountSection } from "../../components/settings/account-section";
import { AboutSection } from "../../components/settings/about-section";
import { HelpSection } from "../../components/settings/help-section";
import { ManageCategoriesCard } from "../../components/categories/manage-categories-card";
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
