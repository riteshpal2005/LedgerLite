import { configureStore, Middleware } from "@reduxjs/toolkit";
import transactionReducer from "./transactionSlice";
import categoryReducer from "./categorySlice";
import settingsReducer from "./settingsSlice";
import accountReducer from "./accountSlice";
import { storage } from "../utils/storage";

const persistSettingsMiddleware: Middleware = (storeAPI) => (next) => (action: any) => {
  const result = next(action);
  if (
    action.type?.startsWith("settings/") &&
    action.type !== "settings/setImportProgress" &&
    action.type !== "settings/setIsGlobalSyncing"
  ) {
    const state = storeAPI.getState() as RootState;
    const { importProgress, isGlobalSyncing, isQuickAddEscaped, ...persistableSettings } = state.settings;
    const settingsVal = JSON.stringify(persistableSettings);
    storage.set("ledgerLite_settings", settingsVal);
  }
  return result;
};

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    categories: categoryReducer,
    settings: settingsReducer,
    accounts: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistSettingsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
