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
  name: "accounts",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    addAccountToRedux: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    updateAccountInRedux: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(
        (acc) => acc.id === action.payload.id,
      );
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    removeAccountFromRedux: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(
        (acc) => acc.id !== action.payload,
      );
    },
  },
});

export const {
  setAccounts,
  addAccountToRedux,
  updateAccountInRedux,
  removeAccountFromRedux,
} = accountSlice.actions;

export const selectAccountsWithBalances = createSelector(
  (state: RootState) => state.accounts.accounts,
  (state: RootState) => state.transactions.transactions,
  (accounts, transactions) => {
    return accounts.map((account) => {
      const accountTransactions = transactions.filter(
        (e) => e.accountId === account.id,
      );

      const totalIncome = accountTransactions
        .filter((e) => e.type === "credit")
        .reduce((sum, e) => sum + e.amount, 0);

      const totalTransaction = accountTransactions
        .filter((e) => e.type === "debit")
        .reduce((sum, e) => sum + e.amount, 0);

      const currentBalance = account.balance + totalIncome - totalTransaction;

      return {
        ...account,
        currentBalance: currentBalance,
      };
    });
  },
);

export default accountSlice.reducer;
