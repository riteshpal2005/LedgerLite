import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsHeader } from "../../components/settings/settings-header";
import { ProfileCard } from "../../components/settings/profile-card";
import { QuickActions } from "../../components/settings/quick-actions";
import { AccountsList } from "../../components/settings/accounts-list";
import { ToolsAndSettings } from "../../components/settings/tools-and-settings";
import { AboutCard } from "../../components/settings/about-card";

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <SettingsHeader />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <ProfileCard />
        <QuickActions />
        <AccountsList />
        <ToolsAndSettings />
        <AboutCard />

        {}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>);

}