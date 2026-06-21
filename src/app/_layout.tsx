import { Stack } from "expo-router";
import { ThemeProvider } from "../core/theme/ThemeContext";
import '../global.css';
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../core/database/schema";
import { Provider } from "react-redux";
import { store } from "../core/store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import * as FileSystem from 'expo-file-system/legacy';
import { loadSettings } from "../core/store/settingsSlice";
import { AuthProvider } from "../core/firebase/AuthContext";
import { UpdateChecker } from "../shared/components/UpdateChecker";

export default function RootLayout() {
  useEffect(() => {
    const fileUri = FileSystem.documentDirectory + 'ledgerLite_settings.json';
    FileSystem.getInfoAsync(fileUri).then(info => {
      if (info.exists) {
        FileSystem.readAsStringAsync(fileUri).then(data => {
          store.dispatch(loadSettings(JSON.parse(data)));
        }).catch(console.error);
      }
    }).catch(console.error);
  }, []);

  return (
    <Provider store={store}>
      <SQLiteProvider databaseName="ledgerlite_v2.db" onInit={initializeDatabase}>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <AuthProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name='(tabs)' />
                  <Stack.Screen name='(auth)' />
                </Stack>
                <UpdateChecker />
              </AuthProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </SQLiteProvider>
    </Provider>
  );
}