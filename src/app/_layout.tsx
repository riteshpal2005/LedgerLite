import { Stack } from "expo-router";
import { ThemeProvider } from "../core/theme/ThemeContext";
import '../global.css';
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../core/database/schema";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="ledgerlite.db" onInit={initializeDatabase}>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SQLiteProvider>
  );
}