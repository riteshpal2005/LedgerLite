import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../database/schema";

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
  },
});

export const { setCategories, addCategory } = categorySlice.actions;
export default categorySlice.reducer;
