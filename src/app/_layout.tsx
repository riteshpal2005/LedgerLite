import { Stack } from "expo-router";
import { ThemeProvider } from "../core/theme/ThemeContext";
import '../global.css';
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../core/database/schema";
import { Provider } from "react-redux";
import { store } from "../core/store/store";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SQLiteProvider databaseName="ledgerlite.db" onInit={initializeDatabase}>
        <ThemeProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </SQLiteProvider>
    </Provider>
  );
}