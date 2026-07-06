import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseSlice";
import categoryReducer from "./categorySlice";
import settingsReducer from "./settingsSlice";
import accountReducer from "./accountSlice";
import { storage } from "../utils/storage";

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    categories: categoryReducer,
    settings: settingsReducer,
    accounts: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      (storeAPI: any) => (next: any) => (action: any) => {
        const result = next(action);
        if (
          action.type?.startsWith("settings/") &&
          action.type !== "settings/setImportProgress" &&
          action.type !== "settings/setIsGlobalSyncing"
        ) {
          const state = storeAPI.getState();
          const { importProgress, isGlobalSyncing, ...persistableSettings } = state.settings;
          const settingsVal = JSON.stringify(persistableSettings);
          storage.set("ledgerLite_settings", settingsVal);
        }
        return result;
      },
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispath = typeof store.dispatch;
