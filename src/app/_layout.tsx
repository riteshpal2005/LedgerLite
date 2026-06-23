import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
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
import { AuthProvider, useAuth } from "../core/firebase/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
SplashScreen.preventAutoHideAsync();
import { UpdateChecker } from "../shared/components/UpdateChecker";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { CustomSplashScreen } from "../shared/components/CustomSplashScreen";

// Ref: _layout-1
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const dbName = user ? `ledgerlite_${user.uid}.db` : "ledgerlite_guest.db";

  return (
    <SQLiteProvider
      key={dbName}
      databaseName={dbName}
      onInit={initializeDatabase}
    >
      {children}
    </SQLiteProvider>
  );
}

function useProtectedRoute(
  user: any,
  isLoading: boolean,
  hasCompletedOnboarding: boolean,
  isSettingsLoaded: boolean,
) {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading || !isSettingsLoaded || !navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isOnboarding = segments[0] === "onboarding";

    if (hasCompletedOnboarding) {
      if (user && (inAuthGroup || isOnboarding)) {
        router.replace("/(tabs)");
      }
    }
  }, [
    user,
    isLoading,
    segments,
    hasCompletedOnboarding,
    navigationState?.key,
    isSettingsLoaded,
  ]);
}

function AuthSplashWrapper({
  children,
  isSettingsLoaded,
}: {
  children: React.ReactNode;
  isSettingsLoaded: boolean;
}) {
  const { isLoading } = useAuth();
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);

  return (
    <>
      {children}
      {!splashAnimationComplete && (
        <CustomSplashScreen
          isReady={isSettingsLoaded && !isLoading}
          onAnimationComplete={() => setSplashAnimationComplete(true)}
        />
      )}
    </>
  );
}

export default function RootLayout() {
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    const fileUri = FileSystem.documentDirectory + "ledgerLite_settings.json";
    FileSystem.getInfoAsync(fileUri)
      .then((info) => {
        if (info.exists) {
          FileSystem.readAsStringAsync(fileUri)
            .then((data) => {
              store.dispatch(loadSettings(JSON.parse(data)));
              setIsSettingsLoaded(true);
            })
            .catch((e) => {
              console.error(e);
              setIsSettingsLoaded(true);
            });
        } else {
          setIsSettingsLoaded(true);
        }
      })
      .catch((e) => {
        console.error(e);
        setIsSettingsLoaded(true);
      });
  }, []);

  if (!isSettingsLoaded) return null;

  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthSplashWrapper isSettingsLoaded={isSettingsLoaded}>
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
        </AuthSplashWrapper>
      </AuthProvider>
    </Provider>
  );
}

function RootLayoutNav({ isSettingsLoaded }: { isSettingsLoaded: boolean }) {
  const { user, isLoading } = useAuth();
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.settings.hasCompletedOnboarding,
  );

  useProtectedRoute(user, isLoading, hasCompletedOnboarding, isSettingsLoaded);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="backdated" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
