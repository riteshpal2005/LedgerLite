import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './expenseSlice';
import categoryReducer from './categorySlice';
import settingsReducer from './settingsSlice';
import accountReducer from './accountSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    categories: categoryReducer,
    settings: settingsReducer,
    accounts: accountReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat((storeAPI: any) => (next: any) => (action: any) => {
      const result = next(action);
      if (action.type?.startsWith('settings/')) {
        const state = storeAPI.getState();
        AsyncStorage.setItem('ledgerLite_settings', JSON.stringify(state.settings)).catch(console.error);
      }
      return result;
    })
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispath = typeof store.dispatch;