import React, { useContext, useMemo } from "react";
import WatermelonDatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { createDatabase } from "./index";
import { AuthContext } from "../firebase/AuthContext";

// Ref: DatabaseProvider-1
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
  const dbName = user ? `ledgerlite_${user.uid}` : "ledgerlite_guest";

  const database = useMemo(() => createDatabase(dbName), [dbName]);

  return (
    // @ts-ignore: WatermelonDB types for DatabaseProvider are incompatible with React 19 JSX
    <WatermelonDatabaseProvider database={database} key={dbName}>
      {children}
    </WatermelonDatabaseProvider>
  );
}
