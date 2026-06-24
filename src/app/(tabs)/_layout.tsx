import { Ionicons } from "@expo/vector-icons";
import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../core/theme/ThemeContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import { useAuth } from "../../core/firebase/AuthContext";
import { useExpenseDatabase } from "../../core/database/useExpenseDatabase";
import { SyncService } from "../../core/services/syncService";
import { MigrationService } from "../../core/services/migrationService";

const syncedSessions = new Set<string>();

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { activeThemeClass } = useTheme();

  const { user } = useAuth();
  const dbActions = useExpenseDatabase();

  useEffect(() => {
    if (user && !syncedSessions.has(user.uid)) {
      syncedSessions.add(user.uid);
      (async () => {
        // Ref: _layout-1
        await MigrationService.migrateGuestDataToUser(user.uid, dbActions);
        // Ref: _layout-2
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
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: {
          backgroundColor: getBackgroundColor(),
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#a1a1aa",
        tabBarIndicatorStyle: {
          backgroundColor: "#2563eb",
          height: 3,
        },
        tabBarShowIcon: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
      }}
    >
      <MaterialTabs.Screen
        name="index"
        options={{
          title: "Expenses",
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
