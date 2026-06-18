import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "../database/schema";

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
export default accountSlice.reducer;
