import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { View } from "react-native";
import { ThemeProvider } from "../core/theme/ThemeContext";
import "../global.css";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../core/database/schema";
import { Provider } from "react-redux";
import { store, RootState } from "../core/store/store";
import { useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import * as FileSystem from "expo-file-system/legacy";
import { loadSettings } from "../core/store/settingsSlice";
import { storage } from "../core/utils/storage";
import { AuthProvider, useAuth } from "../core/firebase/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as QuickActions from "expo-quick-actions";
import { useQuickAction } from "expo-quick-actions/hooks";
import { createContext } from "react";

export let isQuickAddEscaped = false;

export const QuickAddEscapeContext = createContext<{ escapeQuickAdd: () => void } | null>(null);

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

if (!isExpoGo) {
  const Notifications = require("expo-notifications");
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}


const isDirectQuickAddTopLevel = QuickActions.initial?.id === "quick-add";

SplashScreen.preventAutoHideAsync().catch(console.warn);

if (isDirectQuickAddTopLevel) {
  SplashScreen.hideAsync().catch(console.warn);
}

import { UpdateChecker } from "../shared/components/UpdateChecker";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";


configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

import { useTransactionDatabase } from "../core/database/useTransactionDatabase";



import { DatabaseProvider } from "../core/database/DatabaseProvider";
import { useProtectedRoute } from "../core/navigation/useProtectedRoute";





function QuickAddOnlyLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="quick-add"
            options={{ animation: "none" }}
          />
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default function RootLayout() {
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [forceFullApp, setForceFullApp] = useState(false);

  useEffect(() => {
    const loadAppPref = async () => {
      try {
        const fileUri =
          FileSystem.documentDirectory + "ledgerLite_settings.json";
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          const fileData = await FileSystem.readAsStringAsync(fileUri);
          const parsed = JSON.parse(fileData);
          storage.set("ledgerLite_settings", fileData);
          store.dispatch(loadSettings(parsed));
          await FileSystem.deleteAsync(fileUri).catch(console.warn);
        } else {
          const data = storage.getString("ledgerLite_settings");
          if (data) {
            store.dispatch(loadSettings(JSON.parse(data)));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSettingsLoaded(true);
      }
    };
    loadAppPref();
  }, []);



  if (isDirectQuickAddTopLevel && !forceFullApp) {
    return (
      <QuickAddEscapeContext.Provider value={{
        escapeQuickAdd: () => {
          isQuickAddEscaped = true;
          setForceFullApp(true);
        }
      }}>
        <QuickAddOnlyLayout />
      </QuickAddEscapeContext.Provider>
    );
  }

  if (!isSettingsLoaded) return null;

  return (
    <Provider store={store}>
      <AuthProvider>
        <DatabaseProvider>
          <ThemeProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <RootLayoutNav isSettingsLoaded={isSettingsLoaded} />
                <UpdateChecker />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </ThemeProvider>
        </DatabaseProvider>
      </AuthProvider>
    </Provider>
  );
}

import { useTheme } from "../core/theme/ThemeContext";
import { SyncingScreen } from "../shared/components/SyncingScreen";
import { useDispatch } from "react-redux";
import { setUid } from "../core/store/settingsSlice";
import { SyncService } from "../core/services/syncService";

function RootLayoutNav({ isSettingsLoaded }: { isSettingsLoaded: boolean }) {
  const { user, isLoading } = useAuth();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!isLoading) {
      dispatch(setUid(user?.uid ?? null));
      SyncService.resetSyncState();
    }
  }, [user, isLoading]);

  const { activeThemeClass } = useTheme();
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.settings.hasCompletedOnboarding,
  );

  useProtectedRoute(user, isLoading, hasCompletedOnboarding, isSettingsLoaded);

  const router = useRouter();

  useEffect(() => {
    QuickActions.setItems([
      {
        title: "Quick Add",
        subtitle: "Add transaction instantly",
        icon: "ic_quick_add",
        id: "quick-add",
        params: { href: "/quick-add" },
      },
    ]);
  }, []);

  const navigationState = useRootNavigationState();
  const action = useQuickAction();
  const segments = useSegments();

  useEffect(() => {
    if (
      action?.id === "quick-add" &&
      isSettingsLoaded &&
      !isLoading &&
      navigationState?.key
    ) {
      if (segments[0] !== "quick-add") {
        router.push("/quick-add");
      }
    }
  }, [action, isSettingsLoaded, isLoading, navigationState?.key, segments]);

  useEffect(() => {
    if (isSettingsLoaded && !isLoading) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [isSettingsLoaded, isLoading]);



  if (isLoading) {
    return <SyncingScreen />;
  }

  return (
    <View className="flex-1 bg-background">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="backdated" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen
          name="quick-add"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </View>
  );
}
