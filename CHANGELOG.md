#2.1.4

### Added
- **Telegram-style icon preview** in Category Editor: tap-and-hold any icon for 350 ms to see a large modal preview with the icon name; slide the finger to switch icons; release to select.
- `PanResponder`-based gesture handler on the icon grid (replaces brittle `onTouch*` handlers), preventing `BottomSheetScrollView` from intercepting the gesture.

### Changed
- All mutable gesture state stored in refs, eliminating stale-closure bugs from previous `onTouch*` implementation.
- Hit-test function (`iconAtPagePoint`) stored in a stable `useRef` so the `PanResponder` (created once) always sees the latest icon layouts.

### Fixed
- Preview modal no longer gets stuck open after lifting the finger.
- Sliding while holding now correctly switches the preview to the icon under the finger in real time.
- BottomSheet no longer swipes/scrolls while the user is interacting with the icon grid.

---

## [2.1.3] – 2026-07-01

### Added
- **MMKV storage** as the primary storage engine with a transparent `AsyncStorage` fallback for Expo Go / StoreClient.
- `StorageKey` enum and a unified `storage` adapter used across the entire app (replaces raw `AsyncStorage` calls).
- `isPreviewActiveRef` tracks whether the long-press preview is currently visible, used by `PanResponder` move handler.

### Fixed
- `[storage] react-native-mmkv could not be loaded` warning suppressed; MMKV now loads correctly in the dev client after `expo prebuild --clean`.
- Stale-closure bug in icon preview where `previewIcon !== null` always evaluated to `false` due to closure capture.

---

## [2.1.2] – 2026-06-30

### Added
- **Category icon drag-to-preview popover** (initial implementation): long-press opens a preview, slide to switch icon, release to select.
- Overwrite default category icons: Food & Dining → `fast-food`, Self Transfer → `mdi-bank-transfer`.
- Question-mark placeholder icon for expenses whose category no longer exists in the database.

### Fixed
- Page-offset absolute coordinates used to resolve drag-hover preview mapping constraints on the icon grid.
- Corrected MDI icon names: `syringe` → `needle`, `hangar` → `hanger`.

---

## [2.1.1] – 2026-06-28

### Added
- **Self Transfer dual-leg transactions**: saving a "Self Transfer" expense writes both a Debit leg (source account) and a Credit leg (destination account).
- Auto-select destination account when exactly 2 accounts exist.
- `repairSelfTransfers` runs on boot to sequence paired legs chronologically (Debit first, Credit +1 ms later).
- **Infinite scroll pagination** on the expense list: loads 50 items per page up to a 500-item safety cap.
- **CSV/Excel import** enhancements: batch SQLite transactions, chunked background processing with `setTimeout`, local push notifications for import progress, and expanded rich category presets.
- Paired-duplicate matching (`pairedIds` set) to correctly import multiple identical transactions without skipping them.
- Loose category name matching (e.g. "Food and Drinks" → "Food & Dining"); unmapped rows default to `cat-1`.
- `DataManagementSection`: clipboard Paste icon for fast raw JSON backup restoration.
- `importProgress` state + progress bar overlay on the main list screen.

### Fixed
- Deleting a Self Transfer transaction now also removes the partner leg.
- `NOT NULL` constraint violation during import resolved by using `'unmapped'` placeholder for missing categories.
- Date/time parsing made timezone-robust; row keys matched case-insensitively.
- `onEndReached` infinite loop when the dataset fits on one screen.
- Expo Go: bypass `expo-notifications` import to prevent crash; decouple index screen from redux context.

---

## [2.1.0] – 2026-06-24

### Added
- **Custom modal date/time picker** replacing the native `@react-native-community/datetimepicker`:
  - Calculator-style digit-shifting inputs.
  - Dynamic 12 h / 24 h validation modes.
  - Invisible text inputs to eliminate cursor and text-size layout jitter.
- **24-hour time format preference** in Settings; applied to all pickers and list item timestamps.
- `use24HourFormat` redux slice state and `toggle24HourFormat` reducer.
- `PreferencesSection` toggle row in the Settings screen.
- **Running balance** (`balance_after`) column added to `expenses` table via SQLite migration (PRAGMA user_version 2).
- `propagateForward` incremental balance recalculation triggered on every add / edit / delete.
- `addExpensesBatch` for bulk import wrapped in `withTransactionAsync` with single propagation pass per account.
- `ExpenseListItem` displays the balance-after chip next to account name.
- `balance_after` displayed as a blue chip in the expense list for visual clarity.
- **Backdated initial-balance adjustment**: adding/editing/deleting past transactions adjusts the account's opening balance so the current balance remains correct.
- Firebase sync: timezone-safe date parsing; cloud push temporarily disabled to prevent data corruption.

### Fixed
- Excel serial date/time numbers parsed correctly via `cellDates` in SheetJS.
- Locale-aware date order parser (`DD/MM/YYYY`, `MM/DD/YYYY`) added for robust CSV import.
- Import prefers `Date` + `Time` columns over raw Unix timestamps to avoid Excel rounding corruption.
- Inline time parsed from `dateVal` when `timeVal` is missing.
- Balance recalculation correctly handles backdated mode: initial account balance stays untouched for non-backdated operations.

### Tests
- Jest unit tests for Excel serial date/time parsing.
- Jest unit tests for locale-aware date-time parser in `dataService`.
- Jest unit tests for timezone-safe date-time parser.