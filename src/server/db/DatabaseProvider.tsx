import React, { useContext, useMemo, useEffect } from "react";
import { DatabaseProvider as WatermelonDatabaseProvider } from '@nozbe/watermelondb/react';
import { createDatabase } from "./index";
import { AuthContext } from "../firebase/AuthContext";
import { seedDatabase } from "./seed";

// Ref: DatabaseProvider-1
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
  const dbName = user ? `ledgerlite_${user.uid}` : "ledgerlite_guest";

  const database = useMemo(() => createDatabase(dbName), [dbName]);

  useEffect(() => {
    seedDatabase(database).catch(console.error);
  }, [database]);

  return (
    // @ts-ignore: WatermelonDB types for DatabaseProvider are incompatible with React 19 JSX
    <WatermelonDatabaseProvider database={database} key={dbName}>
      {children}
    </WatermelonDatabaseProvider>
  );
}
