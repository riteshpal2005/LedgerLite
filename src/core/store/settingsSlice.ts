import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { 
    showIcons: true,
    defaultAccountId: null as number | null
  },
  reducers: {
    toggleShowIcons: (state) => {
      state.showIcons = !state.showIcons;
    },
    setDefaultAccount: (state, action) => {
      state.defaultAccountId = action.payload;
    }
  }
});

export const { toggleShowIcons, setDefaultAccount } = settingsSlice.actions;
export default settingsSlice.reducer;
