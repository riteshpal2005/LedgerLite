import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Account } from "../database/schema";
import { RootState } from "./store";

interface AccountState {
  accounts: Account[];
}

const initialState: AccountState = {
  accounts: [],
};

export const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    addAccountToRedux: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    }
  },
});

export const { setAccounts, addAccountToRedux } = accountSlice.actions;

export const selectAccountsWithBalances = createSelector(
  (state: RootState) => state.accounts.accounts,
  (state: RootState) => state.expenses.expenses,
  (accounts, expenses) => {
    return accounts.map(account => {
      const accountTransactions = expenses.filter(e => e.accountId === account.id);
      
      const totalIncome = accountTransactions
        .filter(e => e.type === 'credit')
        .reduce((sum, e) => sum + e.amount, 0);
        
      const totalExpense = accountTransactions
        .filter(e => e.type === 'debit')
        .reduce((sum, e) => sum + e.amount, 0);
        
      const currentBalance = account.balance + totalIncome - totalExpense;
      
      return {
        ...account,
        balance: currentBalance // override initial balance with real-time balance
      };
    });
  }
);

export default accountSlice.reducer;
