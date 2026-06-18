import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { 
    showIcons: true,
    defaultAccountId: null as number | null,
    themeOption: 'dark' as 'light' | 'dark' | 'pitch-black' | 'system'
  },
  reducers: {
    toggleShowIcons: (state) => {
      state.showIcons = !state.showIcons;
    },
    setDefaultAccount: (state, action) => {
      state.defaultAccountId = action.payload;
    },
    setThemeOptionRedux: (state, action) => {
      state.themeOption = action.payload;
    },
    loadSettings: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { toggleShowIcons, setDefaultAccount, loadSettings, setThemeOptionRedux } = settingsSlice.actions;
export default settingsSlice.reducer;
