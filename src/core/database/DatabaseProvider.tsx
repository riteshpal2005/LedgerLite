import React, { useContext } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "./schema";
import { AuthContext } from "../firebase/AuthContext";

// Ref: DatabaseProvider-1
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
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
