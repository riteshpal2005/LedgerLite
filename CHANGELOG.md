# 2.0.1

### Android System Integration & App Updates
- **In-App Updater UX:** Integrated Android's Storage Access Framework (SAF) into the update engine. Downloaded APKs are now explicitly saved to a user-selected public directory (e.g., `Downloads`) before triggering the installation.
- **Package Installer Intent Fix:** Added `FLAG_ACTIVITY_NEW_TASK` to the `expo-intent-launcher` to resolve an issue where the native package installer popup was being blocked on Android 11+.
- **Native Splash Screen Fix:** Added explicit `android.splash.backgroundColor` configuration to `app.json` to eliminate the white flash caused by the default Android 12+ Splash Screen API during cold boots.
