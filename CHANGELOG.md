# 2.0.0

### Core Architecture & Features
- **Cloud Sync:** Implemented a robust offline-first sync engine using Firebase Firestore.
- **Authentication:** Added Firebase Auth (Email/Password & Google Sign-In) to support user accounts and strict data isolation.
- **Database Architecture:** Upgraded legacy SQLite database to utilize universally unique identifiers (UUID strings) to enable conflict-free multi-device synchronization. Added a Migration Service to safely migrate data.
- **Enterprise Code Quality:** Extracted all inline explanatory comments to a global `CODE_COMMENTS.md` file using a Reference ID architecture. Stripped all debugging logs and enforced strict formatting via Prettier.

### UI/UX Polish & Flow Restructuring
- **Onboarding Experience:** Redesigned the onboarding screen with a premium blue theme, custom arrow-head chevrons, and improved thumb-zone reachability.
- **State Logic Fixes:** Restructured navigation state to ensure users who abort authentication are properly routed back to onboarding on cold boots unless they explicitly "Start as Guest".
- **Authentication UI:** Completely overhauled the Login and Sign-Up screens. Replaced the generic app icon with a dynamically scaled, tinted floating logo. Shifted forms downward for ergonomic one-handed use (Thumb-zone optimization).
- **Custom Splash Screen:** Overhauled the custom splash screen to use a 1000ms holding delay. Implemented a massive high-resolution logo bypass and created a natural "scale-down and fade-out" exit animation. 

### Expenses & Analytics
- **Analytics Dashboard:** Implemented a highly optimized `react-native-chart-kit` Pie Chart. Added a 200ms skeleton loading delay exclusively for cold boots to guarantee a smooth transition effect.
- **Add Expense Modal:** Fixed Bottom Sheet layout overlap issues. Enabled `interactive` keyboard behavior to prevent the keyboard from pushing the "Save Transaction" button out of reach.
- **List Iteration Refactor:** Updated the Expense List item layout. Formatted the timestamp to strict `HH:mm` format and flex-shrunk text containers to prevent long descriptions from causing the account badge to overflow.
- **Guest Database Retention:** Improved the Migration Service to safely retain the `ledgerlite_guest.db` after a successful cloud registration, preserving the offline-only sandbox.
