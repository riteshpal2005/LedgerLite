# Code Comments Reference

*This file acts as a centralized repository for code explanations, keeping the source code files clean and readable.*

---

### `src/features/expenses/components/AddExpenseSheet.tsx`

- **AddExpenseSheet-1**: Renders the drag handle and title of the Bottom Sheet.
- **AddExpenseSheet-2**: Controlled component to toggle between Debit (Expense) and Credit (Income).
- **AddExpenseSheet-3**: Triggers the full-screen modal to pick a spending category.
- **AddExpenseSheet-4**: Reusable BottomSheetFormField for the primary transaction amount.
- **AddExpenseSheet-5**: Reusable BottomSheetFormFields for optional metadata (Description, Merchant).
- **AddExpenseSheet-6**: Complex component to handle local string state and native date/time pickers.
- **AddExpenseSheet-7**: Dispatches the assembled `expense` object to Redux and the SQLite database.
- **AddExpenseSheet-8**: A native modal sitting on top of the bottom sheet to display the list of categories.
- **AddExpenseSheet-10**: Snap points for the bottom sheet (e.g., 90% of the screen height)
- **AddExpenseSheet-11**: Reset fields
- **AddExpenseSheet-12**: bg-zinc-950 equivalent
- **AddExpenseSheet-13**: text-zinc-400

### `src/shared/components/BottomSheetFormField.tsx`
- **BottomSheetFormField-1**: Optional class for the container
- **BottomSheetFormField-2**: Optional class for the input itself

### `src/features/expenses/components/DateTimePickerSection.tsx`
- **DateTimePickerSection-1**: Local string state so the user can type freely before we validate
- **DateTimePickerSection-2**: Sync string state if the native picker changes the date
- **DateTimePickerSection-3**: Revert if invalid
- **DateTimePickerSection-4**: Basic parse for HH:MM (24h)
- **DateTimePickerSection-5**: Revert if invalid
- **DateTimePickerSection-6**: Date Input
- **DateTimePickerSection-7**: Time Input

### `src/features/analytics/db/analyticsQueries.ts`
- **analyticsQueries-1**: We filter by 'debit' because we only want to chart spending, not income

### `src/features/analytics/components/ExpensePieChart.tsx`
- **ExpensePieChart-1**: Map the raw DB totals to the format required by react-native-chart-kit
- **ExpensePieChart-2**: shows exact values instead of percentages

### `src/features/analytics/components/AnalyticsFilter.tsx`
- **AnalyticsFilter-1**: Run once on mount to set the default 'week' range
- **AnalyticsFilter-2**: Update when custom dates change IF filter is custom
- **AnalyticsFilter-3**: The Selected Dropdown Button
- **AnalyticsFilter-4**: The Dropdown Modal
- **AnalyticsFilter-5**: Custom Date Pickers (only show if filter is custom)

### `src/app/(tabs)/analytics.tsx`
- **analytics-1**: Default to null until the AnalyticsFilter mounts and sends the default "Week" range
- **analytics-2**: Reload data when the screen comes into focus or when dateRange changes

### `src/core/database/schema.ts`
- **schema-1**: DROP TABLE IF EXISTS expenses; (commented out initialization query)
- **schema-2**: Optional to allow legacy transactions to exist without an account until the user assigns them.
- **schema-3**: Safe database migration. We try to add the column, and ignore the error if it already exists.

### `src/core/database/useExpenseDatabase.ts`
- **useExpenseDatabase-1**: Pass accountId, defaulting to null if it's an old legacy entry or not provided.

### `src/app/add-expense.tsx`
- **add-expense-1**: HEADER
- **add-expense-2**: DEBIT / CREDIT TOGGLE
- **add-expense-3**: CATEGORY SELECTOR
- **add-expense-4**: AMOUNT
- **add-expense-5**: TEXT INPUTS
- **add-expense-6**: DATE & TIME BUTTONS (Side by Side!)
- **add-expense-7**: SAVE BUTTON
- **add-expense-8**: THE NATIVE PICKERS & MODALS (Hidden until triggered)
- **add-expense-9**: FULL SCREEN CATEGORY MODAL

### `src/app/(tabs)/settings.tsx`
- **settings-1**: The Toggle Row

### `src/features/expenses/components/ExpenseSortFilter.tsx`
- **ExpenseSortFilter-1**: Destructures the sort, type, and account state setters passed down from the parent (index.tsx) which acts as the single source of truth for the active list view.
- **ExpenseSortFilter-2**: Controls the height of the bottom sheet. 65% provides enough room to show all 3 filter sections (Sort, Type, Accounts) without completely hiding the underlying list context.
- **ExpenseSortFilter-3**: The trigger button dynamically changes its styling (background and icon color) if ANY filter is active, giving the user immediate visual feedback that their list is currently filtered.
- **ExpenseSortFilter-4**: The core Bottom Sheet implementation. Notice how it uses the same visual styling (bg-zinc-950) as AddExpenseSheet to maintain app-wide visual consistency.

### Ref: analytics-1
A better looking skeleton for the pie chart area

### Ref: analytics-2
Artificial delay to show loading animation only on cold boot up

### Ref: _layout-1
Run migration first (it will early exit if no guest data exists)

### Ref: _layout-2
Then start the normal sync process

### Ref: _layout-3
i made this change

### Ref: onboarding-1
Skip Button for Power Users - Fixed height prevents shift

### Ref: onboarding-2
Pagination Dots

### Ref: onboarding-3
Bottom Actions - Fixed height prevents shift

### Ref: _layout-1
Suppress Reanimated strict mode warnings (caused by @gorhom/bottom-sheet in Reanimated v3.16+)

### Ref: dataService-1
US Letter width in points

### Ref: dataService-2
US Letter height in points

### Ref: dataService-3
Wait 1.5s to absolutely guarantee the Android OS has flushed the PDF disk buffer

### Ref: dataService-4
iOS or Share Flow (Just share the URI generated directly by expo-print)

### Ref: migrationService-1
expo-sqlite stores databases in FileSystem.documentDirectory + 'SQLite/'

### Ref: migrationService-2
Open the guest DB directly

### Ref: migrationService-3
Read all records from guest DB

### Ref: migrationService-4
If there's actually data to migrate

### Ref: migrationService-5
1. Migrate Accounts

### Ref: migrationService-6
Force cloud sync

### Ref: migrationService-7
2. Migrate Categories

### Ref: migrationService-8
Force cloud sync

### Ref: migrationService-9
3. Migrate Expenses

### Ref: migrationService-10
Force cloud sync

### Ref: migrationService-11
Push the newly migrated data to the cloud immediately!

### Ref: migrationService-12
We are keeping the guest DB so the user can still use guest mode with previous data

### Ref: syncService-1
Safety check

### Ref: syncService-2
Cleanup any corrupted data from previous bug

### Ref: syncService-3
Force a push of any local pending items first

### Ref: syncService-4
Then pull everything down (which will include our pushed items, plus any from other devices)

### Ref: ExpenseList-1
Small artificial delay for smooth transition effect

### Ref: DataManagementSection-1
Re-fetch since it's updated in DB

### Ref: DataManagementSection-2
Map old numeric IDs (1, 2, 3) to new prefixed IDs (cat-1, cat-2, cat-3)

### Ref: CustomSplashScreen-1
Hide native splash immediately on mount so we can play our "in" animation

### Ref: CustomSplashScreen-2
"In" animation

### Ref: CustomSplashScreen-3
Hold for 1000ms, then animate "out"

### Ref: CustomSplashScreen-4
"Out" animation: smooth scale down and fade out

### Ref: analytics-1
Clear immediately so skeleton shows

### Ref: analytics-2
Fetch data instantly

### Ref: analytics-3
Set Total Spent immediately

### Ref: analytics-4
Artificially delay pie chart rendering to show off skeleton loader

### Ref: analytics-5
Update data silently and instantly on background refresh (e.g. tab switch)

### Ref: dataService-1
Aggregate expenses by category for Pie Chart

### Ref: dataService-2
Simple color palette

### Ref: dataService-3
Fix for Google Drive PDF Viewer issue: Move to DocumentDirectory before sharing

### Ref: syncService-1
10 seconds

### Ref: ColumnSelectionModal-1
Ensure endDate is set to end of the day for accurate filtering

### Ref: ColumnSelectionModal-2
Background extension block rendered first so it sits behind content

### Ref: ColumnSelectionModal-3
Header area

### Ref: DataManagementSection-1
Filter expenses by date

### Ref: UpdateChecker-1
FLAG_GRANT_READ_URI_PERMISSION | FLAG_ACTIVITY_NEW_TASK

### Ref: UpdateChecker-2
User cancelled permission, we can't save to Downloads

### Ref: UpdateChecker-3
Read downloaded file as base64 and write it to the Downloads folder via SAF

### Ref: UpdateChecker-4
Use the SAF content URI directly for the installer

### Ref: UpdateChecker-5
FLAG_GRANT_READ_URI_PERMISSION | FLAG_ACTIVITY_NEW_TASK

### `src/core/database/schema.ts`
- **schema-4**: Migrates older databases by executing `ALTER TABLE expenses ADD COLUMN balance_after REAL` and runs a one-time chronological running balance calculation for all past transactions, saving them to SQLite and queueing them for Firebase push.

### `src/core/database/useExpenseDatabase.ts`
- **useExpenseDatabase-2**: `recalculateBalancesForAccount` loops through non-deleted account transactions chronologically to calculate the running balance, updating any mismatches in SQLite.
- **useExpenseDatabase-3**: DB mutation methods automatically trigger recalculation for affected accounts to maintain database consistency.

### `src/features/expenses/components/AddExpenseSheet.tsx`
- **AddExpenseSheet-14**: Refetches all expenses and accounts from the database and sets them in Redux after any save/delete action to ensure the UI shows fresh running balances.

### `src/features/expenses/components/ExpenseListItem.tsx`
- **ExpenseListItem-1**: Displays the calculated `balance_after` value next to the account name.
- **ExpenseListItem-2**: Custom date formatter that produces the exact requested format: `1:11 PM, 26 Jun`.

### `src/features/analytics/components/AnalyticsFilter.tsx`
- **AnalyticsFilter-6**: Swaps out the native `@react-native-community/datetimepicker` component for the project's custom `CustomDateTimePickerModal`.

### `src/features/expenses/components/CustomDateTimePickerModal.tsx`
- **CustomDateTimePickerModal-1**: Wraps the TextInput inputs in a `Pressable` container to make the entire box area clickable.
- **CustomDateTimePickerModal-2**: Hooks into `onFocus` to move the cursor to the far right, and resets selection 100ms later to permit user readjustment.
- **CustomDateTimePickerModal-3**: Auto-forwards focus to the minutes field when a complete hour (2-digit or 1-digit >= 2) is entered.
- **CustomDateTimePickerModal-4**: Key press handler on minutes input focuses the hour input on Backspace when minutes are empty or "00".

### `src/core/utils/storage.ts`
- **storage-1**: Hybrid storage manager that dynamically falls back to AsyncStorage inside Expo Go (StoreClient) and resolves react-native-mmkv via dynamic require elsewhere to prevent native library load errors during development.

### `src/core/store/store.ts`
- **store-1**: Settings slices are persisted to the hybrid MMKV/AsyncStorage storage adapter instead of raw expo-file-system.

### `src/app/_layout.tsx`
- **_layout-4**: Startup logic reads settings preferences from the hybrid storage adapter. On first-time run, it handles migrating older JSON files from FileSystem to the storage module, cleaning up the legacy settings file.

### `src/core/firebase/config.ts`
- **config-2**: Exposes a storageAdapter translation layers so Firebase Auth persistence runs seamlessly on top of MMKV or AsyncStorage depending on environment.

### `src/core/services/authService.ts`
- **authService-2**: Dynamically imports and configures @react-native-google-signin/google-signin only on standalone builds. In Expo Go, Google Sign-in is bypassed by signing the developer in anonymously, enabling normal access to the cloud backend.

### `src/core/database/schema.ts`
- **schema-5**: Checks PRAGMA user_version on startup. If less than 2, executes the ALTER TABLE statement to add the balance_after column, recalculates all transaction running balances sequentially using chronological sorting ordered by date and rowid, and bumps the user_version to 2.

### `src/core/database/useExpenseDatabase.ts`
- **useExpenseDatabase-4**: `propagateForward` incrementally processes transaction running balances. It locates the immediately preceding transaction in the timeline using `(date < minDate OR (date = minDate AND rowid < startRowid))` to retrieve the starting balance, fetches subsequent transactions ordered by `date ASC, rowid ASC`, and computes and updates running balances in a forward-propagating loop.
- **useExpenseDatabase-5**: `addExpense` gets the new transaction's rowid and propagates forward from its date and rowid.
- **useExpenseDatabase-6**: `deleteExpense` fetches the coordinates of the target transaction before marking it as deleted, then propagates from its position forward.
- **useExpenseDatabase-7**: `updateExpenseFull` and `updateExpenseAccount` identify whether the transaction shifted accounts. If the account is identical, it propagates forward starting at the minimum of the old and new dates; if the account changed, it triggers propagation on both the old and new accounts.

### `src/core/services/dataService.ts`
- **dataService-5**: `parseTimeString` resolves 12-hour AM/PM and 24-hour time strings using regex capture groups, returning normalized hours, minutes, and seconds.
- **dataService-6**: `parseDateTime` converts Excel decimal serial date/time numbers to standard JS Date objects. It handles date/time parsing by matching localized date formats (like `DD/MM/YYYY`) and parsing time fields (numeric fractions or string representations), returning a timezone-safe local Unix timestamp.

### `src/core/database/useExpenseDatabase.ts` (Batch insertion add-on)
- **useExpenseDatabase-8**: `addExpensesBatch` wraps multiple inserts inside a single database transaction `withTransactionAsync` to optimize write speeds, collecting the minimum transaction date per account and running the chronological balance propagation exactly once per account at the end of the transaction.

### `src/core/store/settingsSlice.ts` (Progress tracking add-on)
- **settingsSlice-2**: Exposes `importProgress` state and `setImportProgress` action to coordinate import percentage values across screen UI.

### `src/features/settings/components/DataManagementSection.tsx` (Async chunking and notifications add-on)
- **DataManagementSection-3**: `finalizeImport` requests local push notifications permission, slices massive import tasks into chunks of 200 items processed asynchronously via `setTimeout` to maintain UI responsiveness, dispatches updates to `importProgress`, and pushes status notifications to the background system tray.

### `src/app/_layout.tsx` (Global notification handler add-on)
- **_layout-5**: Initialized top-level notifications handler using `expo-notifications` to capture and render background push notification alerts.

### `src/app/(tabs)/index.tsx` (Progress overlay add-on)
- **index-5**: Renders a visually clean, themed horizontal progress bar card below the header search section when `importProgress > 0`.

### `src/features/expenses/components/ExpenseList.tsx` (Lazy pagination & double loader add-on)
- **ExpenseList-2**: Removes `isGlobalSyncing` from the skeleton loading conditional check so syncing in the background does not block the list display.
- **ExpenseList-3**: Adds infinite scrolling pagination by maintaining `displayLimit` state, slicing the Redux data arrays for display, and hooking `onEndReached` in `FlashList` to render subsequent pages of 50 items up to a performance safety cap of 500 records.

### `src/features/settings/components/RestoreRawJsonModal.tsx` (Clipboard restoration add-on)
- **RestoreRawJsonModal-1**: `handlePaste` reads the current system clipboard using `expo-clipboard`'s `getStringAsync()` and populates the text area value directly, enabling fast, one-tap backup restorations.

### `src/features/expenses/components/AddExpenseSheet.tsx` (Backdated initial balance adjustments)
- **AddExpenseSheet-1**: `handleSave` and `handleDelete` adjust the account's initial balance (`adjustAccountBalance`) dynamically when `isBackdatedMode` is true. Adding/deleting/editing past transactions alters the starting point of the timeline, recalculating all running balances chronologically while keeping the current balance correct.

### `src/features/expenses/components/CustomDateTimePickerModal.tsx` (Dynamic 24h & Calculator-style inputs)
- **CustomDateTimePickerModal-1**: Reads the user's selected 24-hour time format preference (`use24HourFormat`) from Redux and hides/shows AM/PM selectors accordingly.
- **CustomDateTimePickerModal-2**: Implements calculator-style digit-shifting for hour/minute inputs where values shift from right to left (shifting the tens digit and entering the new units digit) while enforcing strict 12h/24h boundaries. It initializes inputs to `"00"` on focus, and routes Backspace to revert focus to the hour input.

### `src/core/store/settingsSlice.ts` (24-Hour toggle state)
- **settingsSlice-3**: Declares `use24HourFormat` state and `toggle24HourFormat` reducer to support switching time configurations globally.

### `src/features/settings/components/PreferencesSection.tsx` (Preferences UI row)
- **PreferencesSection-1**: Dispatches the `toggle24HourFormat` action and binds its toggle status to `CustomToggle` row inside Settings screen.

### `src/features/expenses/components/ExpenseListItem.tsx` (24h list timestamps)
- **ExpenseListItem-4**: Conditionally formats listing item timestamps in either `24h` format or `12h` AM/PM format based on the `use24HourFormat` selector.

### `src/features/expenses/components/DateTimePickerSection.tsx` (Time field display)
- **DateTimePickerSection-2**: Passes `hour12: !use24HourFormat` to `toLocaleTimeString` to dynamically display selected time in 12h/24h format on expense forms.

### `src/core/database/schema.ts` (Seeded transfer categories)
- **schema-2**: Seeds default categories including `'Self Transfer'` and `'Withdraw'` on clean database setups.

### `src/features/categories/components/CategoryEditSheet.tsx` (Rich icons & tooltip display)
- **CategoryEditSheet-1**: Renders a text label tooltip displaying the formatted name of the selected category icon next to the Icon grid header.

### `src/features/expenses/components/AddExpenseSheet.tsx` (Self Transfer dual-leg creation)
- **AddExpenseSheet-2**: Intercepts category selection and dynamically prompts the user to select a destination bank account (or auto-selects if exactly 2 accounts exist) when the category is `'Self Transfer'`.
- **AddExpenseSheet-3**: Writes two synchronized transaction legs (a debit leg on the source account and a credit leg on the destination account) when saving a `'Self Transfer'` transaction.

### `src/core/services/dataService.ts` (CSV matching duplicates)
- **dataService-4**: Uses an unpaired matching set (`pairedIds`) to correctly identify and allow importing identical transactions (e.g. multiple matching items in the CSV source) without skipping them.

### `src/features/expenses/components/ExpenseListItem.tsx` (Missing category placeholder)
- **ExpenseListItem-5**: Renders a gray circle containing a question mark if the category associated with a transaction is missing or not present in the database.
