import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './expenseSlice';
import categoryReducer from './categorySlice';
import settingsReducer from './settingsSlice';
import accountReducer from './accountSlice';

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    categories: categoryReducer,
    settings: settingsReducer,
    accounts: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispath = typeof store.dispatch;