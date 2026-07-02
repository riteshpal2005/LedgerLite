# 2.1.3

### Features
- **Incremental Running Balance Timeline:** Added `balance_after` tracking inside the database schema and created a chronological propagation engine (`propagateForward`) using SQLite ordering. All transaction insertions, edits, deletions, and account transfers automatically recalculate balances forward on the timeline.
- **Redesigned Balance Chip:** Integrated a dedicated, styled light-blue chip in the expense history list next to the bank/account name chip to display the running balance clearly.
- **Global 24-Hour Time Preference:** Added a toggle switch in Settings -> Preferences to switch between 12-hour (AM/PM) and 24-hour time format, dynamically formatting time in pickers, form fields, and historical list item timestamps.
- **Custom Time Picker Digit Shifting:** Re-engineered the time inputs to support calculator-style digit-shifting (entering numbers from right-to-left) with strict validation boundaries matching 12h/24h formats.
- **Clipboard Backup Restoration:** Added a clipboard **Paste** action shortcut icon in the Restore Raw JSON modal top header for one-click backup restoration.
- **Custom Date Picker in Analytics:** Switched native datetimepicker components with the custom project date modal to preserve visual theme consistency.
- **Hybrid Persistent Storage:** Migrated key configurations to MMKV for standalone/production builds, falling back to AsyncStorage in Expo Go environments. Implemented an auto-migration script on application boot.
- **Dev-Client Target Configuration:** Reconfigured package name identifiers to `dev.ritesh.ledgerlite.dev` and created EAS build profiles for Android APK targets to allow side-by-side installations of developer and production clients.
- **Async Batch Imports & Pagination:** Integrated SQLite batch transactions, chunked batch file uploads, progress bars, background push notifications, and list infinite scroll pagination to handle thousands of historical records smoothly.
- Platform‑aware storage abstraction using MMKV with AsyncStorage fallback (`5e4dbca`).
- App storage abstraction integrated across auth routing layout (`e7eea41`).

### Bug Fixes
- **Excel Timestamp Rounding Corruption:** Swapped parsing priority to read readable Date and Time string columns first, falling back to Unix millisecond timestamps only if missing. This completely avoids precision loss and duplicate checks from Excel scientific notation rounding.
- **Timezone-Shift Import Errors:** ReplacedHermes' fragile native `new Date()` parsing with UTC component extraction (`getUTCHours()`, `getUTCDate()`, etc.) to prevent GMT offsets from shifting transaction times.
- **Time Picker Layout Jitter:** Replaced visible text input fields with invisible keystroke routers to completely eliminate cursor blinking, font sizing changes, and keyboard jitter during typing.
- **Infinite Scrolling Loops:** Added upper boundary checks to the list's `onEndReached` callback to prevent rendering trigger loops on small datasets.
- **Backdated Initial Balance Calculation:** Fixed the backdated ledger mode to accurately offset the account's initial starting balance across Add, Edit, and Delete actions, keeping the current balance correct.
- **Firebase Sync Date Parser:** Refactored pull parsing to format dates timezone-safely using local parse engines and added temporary cloud push guards.
- **Expo Go Safe Notifications:** Decoupled expo-notifications into dynamic imports to prevent native crash warnings in clean SDK clients.

### Chores
- Removed `expo-modules-core` (`5e5206f`).
- Updated dependencies (`96a93e7`).
- Cleaned workspace / started crash‑fix branch (`5a9b1ac`).