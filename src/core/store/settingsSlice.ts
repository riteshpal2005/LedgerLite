import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    showIcons: true,
    hapticsEnabled: true,
    defaultAccountId: null as string | null,
    themeOption: "dark" as "light" | "dark" | "pitch-black" | "system",
    exportDirectoryUri: null as string | null,
    hasCompletedOnboarding: false,
    isGlobalSyncing: false,
    importProgress: 0,
    use24HourFormat: false,
  },
  reducers: {
    toggleShowIcons: (state) => {
      state.showIcons = !state.showIcons;
    },
    toggleHaptics: (state) => {
      state.hapticsEnabled = !state.hapticsEnabled;
    },
    toggle24HourFormat: (state) => {
      state.use24HourFormat = !state.use24HourFormat;
    },
    setDefaultAccount: (state, action) => {
      state.defaultAccountId = action.payload;
    },
    setThemeOptionRedux: (state, action) => {
      state.themeOption = action.payload;
    },
    loadSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
    setExportDirectoryUri: (state, action) => {
      state.exportDirectoryUri = action.payload;
    },
    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
    },
    setIsGlobalSyncing: (state, action) => {
      state.isGlobalSyncing = action.payload;
    },
    setImportProgress: (state, action) => {
      state.importProgress = action.payload;
    },
  },
});

export const {
  toggleShowIcons,
  toggleHaptics,
  toggle24HourFormat,
  setDefaultAccount,
  loadSettings,
  setThemeOptionRedux,
  setExportDirectoryUri,
  completeOnboarding,
  setIsGlobalSyncing,
  setImportProgress,
} = settingsSlice.actions;
export default settingsSlice.reducer;
