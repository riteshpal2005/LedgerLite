import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { showIcons: true },
  reducers: {
    toggleShowIcons: (state) => {
      state.showIcons = !state.showIcons;
    }
  }
});

export const { toggleShowIcons } = settingsSlice.actions;
export default settingsSlice.reducer;
