import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type QuickTemplate = {
  id: string;
  title: string;
  amount: string;
  description: string;
  merchant: string;
  categoryId: string;
  accountId: string | undefined;
  type: "debit" | "credit";
};

export type SettingsState = {
  showIcons: boolean;
  hapticsEnabled: boolean;
  defaultAccountId: string | null;
  themeOption: "light" | "dark" | "pitch-black" | "system";
  currency: string;
  exportDirectoryUri: string | null;
  hasCompletedOnboarding: boolean;
  isGlobalSyncing: boolean;
  importProgress: number;
  use24HourFormat: boolean;
  quickTemplates: QuickTemplate[];
  uid: string | null;
};

const initialState: SettingsState = {
  showIcons: true,
  hapticsEnabled: true,
  defaultAccountId: null,
  themeOption: "dark",
  currency: "INR",
  exportDirectoryUri: null,
  hasCompletedOnboarding: false,
  isGlobalSyncing: false,
  importProgress: 0,
  use24HourFormat: false,
  quickTemplates: [],
  uid: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
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
    setDefaultAccount: (state, action: PayloadAction<string | null>) => {
      state.defaultAccountId = action.payload;
    },
    setThemeOptionRedux: (state, action: PayloadAction<"system" | "light" | "dark" | "pitch-black">) => {
      state.themeOption = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    loadSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return {
        ...state,
        ...action.payload,
        importProgress: 0,
        isGlobalSyncing: false,
      };
    },
    setExportDirectoryUri: (state, action: PayloadAction<string | null>) => {
      state.exportDirectoryUri = action.payload;
    },
    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
    },
    setIsGlobalSyncing: (state, action: PayloadAction<boolean>) => {
      state.isGlobalSyncing = action.payload;
    },
    setImportProgress: (state, action: PayloadAction<number>) => {
      state.importProgress = action.payload;
    },
    addQuickTemplate: (state, action: PayloadAction<QuickTemplate>) => {
      state.quickTemplates.push(action.payload);
    },
    removeQuickTemplate: (state, action: PayloadAction<string>) => {
      state.quickTemplates = state.quickTemplates.filter(t => t.id !== action.payload);
    },
    setUid: (state, action: PayloadAction<string | null>) => {
      state.uid = action.payload;
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
  setCurrency,
  setExportDirectoryUri,
  completeOnboarding,
  setIsGlobalSyncing,
  setImportProgress,
  addQuickTemplate,
  removeQuickTemplate,
  setUid,
} = settingsSlice.actions;
export default settingsSlice.reducer;
