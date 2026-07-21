import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "../server/db/schema";

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: []
};

export const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },

    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },

    updateTransactionAction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },

    deleteTransactionAction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter((e) => e.id !== action.payload);
    }
  }
});

export const {
  setTransactions,
  addTransaction,
  updateTransactionAction,
  deleteTransactionAction
} = transactionSlice.actions;
export default transactionSlice.reducer;