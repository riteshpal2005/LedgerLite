import { Stack } from "expo-router";
import { ThemeProvider } from "../core/theme/ThemeContext";
import '../global.css';
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../core/database/schema";
import { Provider } from "react-redux";
import { store } from "../core/store/store";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import * as FileSystem from 'expo-file-system/legacy';
import { loadSettings } from "../core/store/settingsSlice";

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
      <SQLiteProvider databaseName="ledgerlite.db" onInit={initializeDatabase}>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name='(tabs)' />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </SQLiteProvider>
    </Provider>
  );
}