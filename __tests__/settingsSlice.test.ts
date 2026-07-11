import settingsReducer, {
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
  addQuickTemplate,
  removeQuickTemplate,
  setUid,
  QuickTemplate,
} from '../src/store/settingsSlice';

describe('settingsSlice', () => {
  const initialState = {
    showIcons: true,
    hapticsEnabled: true,
    defaultAccountId: null,
    themeOption: "dark" as const,
    exportDirectoryUri: null,
    hasCompletedOnboarding: false,
    isGlobalSyncing: false,
    importProgress: 0,
    use24HourFormat: false,
    quickTemplates: [],
    uid: null,
  };

  it('should handle initial state', () => {
    expect(settingsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle toggleShowIcons', () => {
    const actual = settingsReducer(initialState, toggleShowIcons());
    expect(actual.showIcons).toBe(false);
  });

  it('should handle toggleHaptics', () => {
    const actual = settingsReducer(initialState, toggleHaptics());
    expect(actual.hapticsEnabled).toBe(false);
  });

  it('should handle toggle24HourFormat', () => {
    const actual = settingsReducer(initialState, toggle24HourFormat());
    expect(actual.use24HourFormat).toBe(true);
  });

  it('should handle setDefaultAccount', () => {
    const actual = settingsReducer(initialState, setDefaultAccount('acc1'));
    expect(actual.defaultAccountId).toBe('acc1');
  });

  it('should handle setThemeOptionRedux', () => {
    const actual = settingsReducer(initialState, setThemeOptionRedux('light'));
    expect(actual.themeOption).toBe('light');
  });

  it('should handle setExportDirectoryUri', () => {
    const actual = settingsReducer(initialState, setExportDirectoryUri('content://some/path'));
    expect(actual.exportDirectoryUri).toBe('content://some/path');
  });

  it('should handle completeOnboarding', () => {
    const actual = settingsReducer(initialState, completeOnboarding());
    expect(actual.hasCompletedOnboarding).toBe(true);
  });

  it('should handle setIsGlobalSyncing', () => {
    const actual = settingsReducer(initialState, setIsGlobalSyncing(true));
    expect(actual.isGlobalSyncing).toBe(true);
  });

  it('should handle setImportProgress', () => {
    const actual = settingsReducer(initialState, setImportProgress(50));
    expect(actual.importProgress).toBe(50);
  });

  it('should handle setUid', () => {
    const actual = settingsReducer(initialState, setUid('user123'));
    expect(actual.uid).toBe('user123');
  });

  it('should handle addQuickTemplate and removeQuickTemplate', () => {
    const template: QuickTemplate = {
      id: 't1',
      title: 'Coffee',
      amount: '5',
      description: 'Morning Coffee',
      merchant: 'Starbucks',
      categoryId: 'cat1',
      accountId: 'acc1',
      type: 'debit',
    };
    
    let actual = settingsReducer(initialState, addQuickTemplate(template));
    expect(actual.quickTemplates).toEqual([template]);
    
    actual = settingsReducer(actual, removeQuickTemplate('t1'));
    expect(actual.quickTemplates).toEqual([]);
  });

  it('should handle loadSettings', () => {
    const newSettings = {
      themeOption: 'system' as const,
      hapticsEnabled: false,
      importProgress: 100, // Should be reset to 0
      isGlobalSyncing: true, // Should be reset to false
    };
    
    const actual = settingsReducer(initialState, loadSettings(newSettings));
    expect(actual.themeOption).toBe('system');
    expect(actual.hapticsEnabled).toBe(false);
    expect(actual.importProgress).toBe(0);
    expect(actual.isGlobalSyncing).toBe(false);
  });
});
