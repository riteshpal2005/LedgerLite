import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { View } from "react-native";
import { ThemeProvider } from "../hooks/theme/ThemeContext";
import "../global.css";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../server/db/schema";
import { Provider } from "react-redux";
import { store, RootState } from "../store/store";
import { useSelector } from "react-redux";
import { setTransactions } from "../store/transactionSlice";
import { setCategories } from "../store/categorySlice";
import { setAccounts } from "../store/accountSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import { Paths, File } from "expo-file-system";
import { loadSettings } from "../store/settingsSlice";
import { storage } from "../utils/storage";
import { AuthProvider, useAuth } from "../server/firebase/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { createContext } from "react";

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

SplashScreen.preventAutoHideAsync().catch(console.warn);

import { UpdateChecker } from "../components/ui/update-checker";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

import { useTransactionDatabase } from "../server/db/useTransactionDatabase";
import { DatabaseProvider } from "../server/db/DatabaseProvider";
import { useProtectedRoute } from "../hooks/navigation/useProtectedRoute";

export default function RootLayout() {
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    const loadAppPref = async () => {
      try {
        const fileUri = Paths.document.uri + "ledgerLite_settings.json";
        const file = new File(fileUri);
        if (file.exists) {
          const fileData = await file.text();
          const parsed = JSON.parse(fileData);
          storage.set("ledgerLite_settings", fileData);
          store.dispatch(loadSettings(parsed));
          try { file.delete(); } catch(e) { console.warn(e); }
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



import { useTheme } from "../hooks/theme/ThemeContext";
import { SyncingScreen } from "../components/ui/syncing-screen";
import { useDispatch } from "react-redux";
import { setUid } from "../store/settingsSlice";
import { SyncService } from "../server/services/syncService";

function RootLayoutNav({ isSettingsLoaded }: { isSettingsLoaded: boolean }) {
  const { user, isLoading } = useAuth();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!isLoading) {
      dispatch(setUid(user?.uid ?? null));
      SyncService.resetSyncState();
    }
  }, [user?.uid, isLoading]);

  const {
    getAllTransactions,
    getAllCategories,
    getAllAccounts,
  } = useTransactionDatabase();

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const transactionData = await getAllTransactions();
        if (!isMounted) return;
        dispatch(setTransactions(transactionData));

        const categoryData = await getAllCategories();
        if (!isMounted) return;
        dispatch(setCategories(categoryData));

        const accountsData = await getAllAccounts();
        if (!isMounted) return;
        dispatch(setAccounts(accountsData));
      } catch (error) {
        console.warn("Global load failed", error);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const { activeThemeClass } = useTheme();
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.settings.hasCompletedOnboarding,
  );

  useProtectedRoute(user, isLoading, hasCompletedOnboarding, isSettingsLoaded);

  const router = useRouter();

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
        <Stack.Screen name="developer" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
      </Stack>
    </View>
  );
}
