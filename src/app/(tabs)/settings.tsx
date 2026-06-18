import { View, Text, ScrollView } from "react-native";
import { PreferencesSection } from "../../features/settings/components/PreferencesSection";
import { AccountsSection } from "../../features/settings/components/AccountsSection";
import { DataManagementSection } from "../../features/settings/components/DataManagementSection";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-background p-6 pt-12">
      <Text className="text-3xl font-bold text-primary mb-8">Settings</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <PreferencesSection />
        <AccountsSection />
        <DataManagementSection />
        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
