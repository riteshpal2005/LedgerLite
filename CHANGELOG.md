# v1.3.1

### Features
- **Cloud Sync:** Implemented comprehensive offline-first sync engine using Firebase Firestore.
- **Authentication:** Added Firebase Auth (Email/Password & Google Sign-In) to support user accounts.
- **UUID Migration:** Upgraded local SQLite database schema to use universally unique identifiers (UUID strings) instead of auto-incrementing integers, enabling safe multi-device synchronization.
- **Atomic UI Components:** Introduced new reusable atomic UI components (`AuthInput`, `AuthButton`, `CategoryGrid`, `TotalSpentCard`, `ManageCategoriesCard`) for cleaner screen architecture.
- **Password Toggle:** Added an interactive "eye" toggle icon to all password fields for better UX during authentication.

### Bug Fixes
- **Firebase Persistence:** Fixed a critical startup crash caused by an invalid React Native Metro resolution path for `@firebase/auth` persistence.
- **Z-Index Stacking:** Fixed a UI layering bug in the Data Management section where dropdown menus were rendering beneath adjacent rows.
- **ABI Emulator Support:** Made the `arm64-v8a` split compilation flag strictly conditional for CI environments to prevent crashes on local `x86_64` emulators.

### Build & Architecture
- **CI/CD Optimization:** Updated GitHub Actions release workflow to use Node 20, explicitly build `arm64-v8a` APKs natively, and dynamically rename output to `LedgerLite-v1.3.1.apk`.
- **UI Refactoring:** Removed heavy inline UI logic from core Expo Router screens (`src/app/`), offloading them to modular feature components.
- **Code Cleanup:** Stripped all arbitrary inline code comments across the `src/` directory to enforce clean code architecture and external reference documentation.

### UI/UX Polish
- **Accordion Menus:** Converted Export and Import settings rows into an accordion pattern, ensuring only one dropdown menu can be expanded at a time.
