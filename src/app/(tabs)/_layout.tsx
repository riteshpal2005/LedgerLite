import { Ionicons } from "@expo/vector-icons";
import { withLayoutContext, useRouter } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/theme/ThemeContext";
import { useEffect } from "react";
import { useAuth } from "../../server/firebase/AuthContext";
import { useTransactionDatabase } from "../../server/db/useTransactionDatabase";
import { SyncService } from "../../server/services/syncService";
import { MigrationService } from "../../server/services/migrationService";

const syncedSessions = new Set<string>();

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTabs = withLayoutContext(Navigator);

import { View, Text, TouchableOpacity } from "react-native";

export { ErrorBoundary } from "expo-router";

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View 
      className="flex-row bg-[#0a0b0d] items-center justify-between border-t border-[#1b1b1c]" 
      style={{ height: 70 + insets.bottom, paddingBottom: insets.bottom, paddingHorizontal: 10 }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("index")} className="items-center flex-1">
        <Ionicons name={state.index === 0 ? "home" : "home-outline"} size={24} color={state.index === 0 ? "#6642f8" : "#6b7280"} />
        <Text style={{ color: state.index === 0 ? "#6642f8" : "#6b7280", fontSize: 10, marginTop: 4, fontWeight: "bold" }}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("transactions")} className="items-center flex-1">
        <Ionicons name={state.index === 1 ? "layers" : "layers-outline"} size={24} color={state.index === 1 ? "#6642f8" : "#6b7280"} />
        <Text style={{ color: state.index === 1 ? "#6642f8" : "#6b7280", fontSize: 10, marginTop: 4, fontWeight: "bold" }}>Transactions</Text>
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center relative z-50">
        <TouchableOpacity 
          className="w-16 h-16 bg-[#6642f8] rounded-full items-center justify-center absolute -top-8 border-[6px] border-[#0a0b0d]"
          style={{ shadowColor: "#6642f8", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 }}
          onPress={() => router.push("/add-transaction")}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("analytics")} className="items-center flex-1">
        <Ionicons name={state.index === 2 ? "bar-chart" : "bar-chart-outline"} size={24} color={state.index === 2 ? "#6642f8" : "#6b7280"} />
        <Text style={{ color: state.index === 2 ? "#6642f8" : "#6b7280", fontSize: 10, marginTop: 4, fontWeight: "bold" }}>Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("settings")} className="items-center flex-1">
        <Ionicons name={state.index === 3 ? "list" : "list-outline"} size={24} color={state.index === 3 ? "#6642f8" : "#6b7280"} />
        <Text style={{ color: state.index === 3 ? "#6642f8" : "#6b7280", fontSize: 10, marginTop: 4, fontWeight: "bold" }}>More</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { activeThemeClass } = useTheme();

  const { user } = useAuth();
  const dbActions = useTransactionDatabase();

  useEffect(() => {
    if (user && !syncedSessions.has(user.uid)) {
      syncedSessions.add(user.uid);
      (async () => {

        await MigrationService.migrateGuestDataToUser(user.uid, dbActions);

        await SyncService.syncAll(user.uid, dbActions);
      })();
    }
  }, [user]);

  const getBackgroundColor = () => {
    if (activeThemeClass === "theme-pitch-black") return "#09090b";
    if (activeThemeClass === "theme-dark") return "#18181b";
    return "#f4f4f5";
  }; // Ref: _layout-3

  const getTextColor = () => {
    if (activeThemeClass === "") return "#000000";
    return "#ffffff";
  };

  return (
    <MaterialTabs
      tabBarPosition="bottom"
      initialRouteName="index"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
      }}
    >
      <MaterialTabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <MaterialTabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="cash-outline" size={24} color={color} />
          ),
        }}
      />
      <MaterialTabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="pie-chart" size={24} color={color} />
          ),
        }}
      />
      <MaterialTabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </MaterialTabs>
  );
}
