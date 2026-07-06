import React from "react";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "./schema";
import { useAuth } from "../firebase/AuthContext";

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
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
