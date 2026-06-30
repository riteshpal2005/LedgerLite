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
        if (action.type?.startsWith("settings/")) {
          const state = storeAPI.getState();
          const settingsVal = JSON.stringify(state.settings);
          const res = storage.setItem("ledgerLite_settings", settingsVal);
          if (res instanceof Promise) {
            res.catch(console.error);
          }
        }
        return result;
      },
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispath = typeof store.dispatch;
