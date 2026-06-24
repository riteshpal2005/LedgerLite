# 2.0.2

### Refactoring & Architecture
- **Native Splash Screen Optimization:** Removed custom Javascript-based artificial splash screen (`CustomSplashScreen.tsx`) in favor of utilizing the native Android 12+ API entirely. Configured the `expo-splash-screen` plugin correctly in `app.json` to handle the native logo and background color.
- **Hydration State Binding:** Refactored `_layout.tsx` to directly bind the native `SplashScreen.hideAsync()` call to the app's SQLite and Firebase Auth hydration states, preventing double-splashes.
