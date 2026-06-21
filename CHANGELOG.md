# 1.3.2

### Core Architecture & Features
- **Cloud Sync:** Implemented comprehensive offline-first sync engine using Firebase Firestore.
- **Authentication:** Added Firebase Auth (Email/Password & Google Sign-In) to support user accounts.
- **Database Architecture:** Implemented local SQLiteProvider with robust schema migrations for accounts, categories, and expenses. Upgraded to universally unique identifiers (UUID strings) to enable safe multi-device synchronization.
- **UI/UX Architecture:** Built scalable, persistent semantic multi-theming engine via Context and Redux.
- **Atomic UI Components:** Introduced modern reusable atomic UI components (`AuthInput`, `AuthButton`, `CategoryGrid`, `TotalSpentCard`, `ManageCategoriesCard`) for cleaner screen architecture.

### Expense & Data Management
- **Account Management:** Designed intuitive account row UX using action sheets, implemented full CRUD edit capabilities, and added an auto-default assignment engine.
- **Advanced Filtering:** Implemented robust advanced filter and sort bottom sheet with strict typing.
- **Time-Travel Sandbox:** Developed a dedicated time-travel sandbox screen for backdated transactions.
- **Data Export Engine:** Built a dynamic PDF export engine with custom column selection, HTML escaping, and native Rupee formatting. Included Excel (XLSX) and CSV portability engines.
- **Password Toggle:** Added an interactive "eye" toggle icon to all password fields for better UX during authentication.
- **Real-time Account Balances:** Implemented real-time dynamic balance calculations across all accounts.

### UI/UX Polish & Analytics
- **Live Authentication Validation:** Implemented real-time regex email validation in the Login and Register screens.
- **Visual Error States:** Added beautiful red error states (borders, backgrounds, and helper text) for invalid inputs.
- **Friendly Error Parsing:** Intercept cryptic Firebase error codes and translate them into human-readable strings displayed via a custom `CustomAlert` modal.
- **App Logo Integration:** Implemented the actual LedgerLite application logo natively into the app layout.
- **Analytics Dashboard:** Integrated dynamic Redux data into a pie chart with precise date range filtering and SQLite aggregations.

### Stability & Bug Fixes
- **Hermes Release Crash:** Fixed a fatal crash in Release mode caused by Hermes failing to resolve dynamic CommonJS requires for `@firebase/auth`.
- **Z-Index Stacking:** Fixed UI layering bugs in the Data Management section where dropdown menus were rendering beneath adjacent rows.
- **NativeWind Compatibility:** Resolved various NativeWind crashes and optimized FlashList performance to prevent memory leaks.
- **Accordion Menus:** Converted settings rows into an accordion pattern to ensure only one dropdown menu expands at a time.
- **State Hydration:** Resolved Redux memoization warnings and migrated settings persistence to the FileSystem.

### Build & CI/CD
- **Automated Pipelines:** Configured automated GitHub Actions release pipelines for automated Android APK generation.
- **Optimized Artifacts:** Configured workflow to use Node 20, explicitly build lightweight `arm64-v8a` APKs natively, and dynamically rename output to match the release tag (`LedgerLite-v1.3.2.apk`).
- **Emulator Support:** Made ABI architecture splits strictly conditional for CI environments to prevent crashes on local `x86_64` emulator testing.
