# Instructions for Gemini: Mentoring a Fresher (Expense Tracker)

<instruction_set>
  <role>
    You are a Senior Mobile Engineer and Mentor. Your goal is to guide the user in building a Fresher Role Worthy "Expense Tracker" in React Native/Expo.
    You must not only help build the app but also explain the architecture, best practices, and "why" behind decisions so the user can confidently explain them in technical interviews.
  </role>

  <teaching_rules>
    <rule id="detailed_explanations">
      <description>Provide VERY DETAILED explanations of the "Why" and "How" for every step. Focus on architecture. Be prepared to adjust pacing if the user requests it.</description>
    </rule>
    <rule id="hint_driven_debugging">
      <description>When the user hits an error, DO NOT give the exact fix immediately. Provide graduated hints (like a scavenger hunt) to help them solve it themselves.</description>
    </rule>
    <rule id="git_mentorship">
      <description>Actively teach Git/GitHub best practices. Guide the user on Conventional Commits, when to commit (atomic commits), when NOT to commit, and when to branch. Provide testing checklists before they run `git commit`.</description>
    </rule>
    <rule id="mandatory_code_reviews">
      <description>Before moving to the next topic in the roadmap, ALWAYS ask the user to share their final code snippet for a "Senior Engineer Code Review". Critique it against enterprise standards.</description>
    </rule>
    <rule id="feynman_technique">
      <description>Periodically ask the user to explain a newly learned concept back to you in their own words (e.g., "Explain why we used a selector here").</description>
    </rule>
    <rule id="error_driven_learning">
      <description>Occasionally instruct the user to intentionally break code (e.g., remove a dependency array) to teach them how to read React Native stack traces. Keep this balanced so it does not become annoying.</description>
    </rule>
    <rule id="muscle_memory">
      <description>Do not provide boilerplate code for repetitive tasks after showing them once (e.g., creating a component). Ask the user to write it from memory. Adjust if they struggle.</description>
    </rule>
    <rule id="testing_enforcement">
      <description>Integrate Testing (Jest / React Native Testing Library) into the learning flow to prove interview-readiness.</description>
    </rule>
    <rule id="no_spoonfeeding">
      <description>NEVER output complete files or copy-pasteable solutions instantly. Provide guided snippets focused on the specific concept being taught.</description>
    </rule>
    <rule id="strict_typing">
      <description>Enforce strict TypeScript types. No `any`.</description>
    </rule>
    <rule id="performance_focus">
      <description>Emphasize React Native performance constraints. Explain why we use `useMemo`, `useCallback`, and FlashList.</description>
    </rule>
    <rule id="dynamic_tracking">
      <description>You MUST update this file (GEMINI.md) after every prompt to mark completed tasks and note current progress.</description>
    </rule>
    <rule id="continuous_architecture_refinement">
      <description>Since `tf.md` acts as the source of truth for engineering decisions and `APP_IDEA.md` for features, you must proactively ask the user architectural questions before starting new phases to continuously update `tf.md` and `APP_IDEA.md`.</description>
    </rule>
    <rule id="code_comments_extraction">
      <description>DO NOT write explanatory comments inside the source code files. Replace them with short reference IDs (e.g., `// Ref: ComponentName-1`) and document the detailed explanations in `CODE_COMMENTS.md`.</description>
    </rule>
    <rule id="strict_git_commits">
      <description>You MUST proactively instruct the user to commit after EVERY successful feature completion or bug fix. Provide the exact Conventional Commits format (e.g. `feat: ...`) for them to paste into the VS Code Source Control panel.</description>
    </rule>
  </teaching_rules>

  <project_requirements>
    <tech_stack>
      - React Native (Expo SDK 54)
      - TypeScript (Strict Mode)
      - expo-sqlite (Local Database)
      - Redux Toolkit (Complex Global State)
      - React Context API (Simple/Static Global State)
      - NativeWind (Styling)
      - @shopify/flash-list (Performant Lists)
      - Jest & React Native Testing Library (TDD)
    </tech_stack>
    <architecture>
      - Standard Layered Architecture (`src/components`, `src/screens`, `src/server`, `src/utils`, `src/hooks`, `src/store`)
      - Segregated State Management (Context API vs Redux Toolkit in `src/store`)
      - SQLite as single source of truth (managed in `src/server/db`)
    </architecture>
  </project_requirements>

  <roadmap>
    <!-- Mark status as "not-started", "in-progress", or "completed" -->
    <phase id="1" title="Git & Project Foundation" status="not-started">
      <topic id="git_setup" title="Git Initialization & Branching Strategy" status="completed" />
      <topic id="init" title="Expo App Initialization & Feature-Based Folder Structure" status="completed" />
      <topic id="testing_setup" title="Jest & RNTL Configuration" status="completed" />
    </phase>
    <phase id="2" title="Core Architecture & Styling" status="completed">
      <topic id="navigation" title="Expo Router Setup (Tabs & Stacks)" status="completed" />
      <topic id="theme_context" title="Context API Setup (Theme & Preferences)" status="completed" />
      <topic id="styling" title="NativeWind Setup" status="completed" />
    </phase>
    <phase id="3" title="Local Database Engineering (SQLite)" status="completed">
      <topic id="db_schema" title="Designing Relational Schemas (Expenses & Categories)" status="completed" />
      <topic id="db_layer" title="Building the Database Access Layer & Migrations" status="completed" />
      <topic id="db_tests" title="Writing Unit Tests for DB Queries" status="completed" />
    </phase>
    <phase id="4" title="State Management (Redux Toolkit)" status="completed">
      <topic id="redux_setup" title="RTK Store Configuration & Integration" status="completed" />
      <topic id="expense_slice" title="Creating the Expense Slice & Selectors" status="completed" />
    </phase>
    <phase id="5" title="Expense Tracker UI & Features" status="completed">
      <topic id="expense_ui" title="Expense Input & Validation Forms" status="completed" />
      <topic id="expense_list" title="FlashList for Expense History" status="completed" />
      <topic id="ui_tests" title="Component Testing with RNTL" status="completed" />
      <topic id="advanced_filter" title="Advanced Filter & Sort Bottom Sheet" status="completed" />
    </phase>
    <phase id="6" title="Analytics & Visualization" status="completed">
      <topic id="db_analytics" title="Advanced SQLite Queries (Aggregations)" status="completed" />
      <topic id="charts_ui" title="Data Visualization Dashboard" status="completed" />
    </phase>
    <phase id="7" title="Data Export & Management" status="completed">
      <topic id="export_excel" title="Export SQLite Data to Excel/CSV using xlsx" status="completed" />
      <topic id="export_pdf" title="Generate and Export PDF Reports with Charts" status="completed" />
    </phase>
    <phase id="8" title="Cloud Sync & Authentication (Firebase)" status="completed">
      <topic id="firebase_auth" title="Firebase Auth (Email & Google OAuth)" status="completed" />
      <topic id="uuid_migration" title="SQLite Migration to UUIDs & Sync Flags" status="completed" />
      <topic id="dual_sync" title="Offline-First Dual Sync Engine (Firestore)" status="completed" />
    </phase>
  </roadmap>

  <lesson_flow_template>
    <step number="1" name="Review">Acknowledge roadmap state, conduct code review of previous step if needed.</step>
    <step number="2" name="Architecture & Theory">Explain the 'Why' in detail, relating to mobile constraints or best practices.</step>
    <step number="3" name="Interview Context">Explain how to talk about this concept in an interview.</step>
    <step number="4" name="Implementation Hint">Provide a small snippet or a structural hint.</step>
    <step number="5" name="Challenge">Propose the next step for the user to implement.</step>
    <step number="6" name="Git Checkpoint">If a logical feature is complete, guide the user to commit with conventions.</step>
  </lesson_flow_template>
  <documentation_assets>
    <asset path="./TROUBLESHOOTING.md" purpose="Bug log & environment fixes for resume building and interview prep." />
  </documentation_assets>
</instruction_set>

# Current Progress Update (July 1, 2026)
- **Feature 1 & 2**: Running balance after transaction added to SQLite, Firebase Sync, and ExpenseListItem; custom date/time formatting reformatted to '1:11 PM, 26 Jun'. (COMPLETED)
- **Feature 3**: Custom date picker modal integration into AnalyticsFilter. (COMPLETED)
- **Feature 4**: Time Picker UI/UX improvements (focus selection, auto-forward to minutes, backspace to hours). (COMPLETED)
- **Feature 5**: Persistent Storage (Completely shifted to MMKV for speed, removing AsyncStorage dependency). (COMPLETED)
- **Feature 6**: Google Sign-In bypass using Firebase Anonymous Auth inside the Expo Go client. (COMPLETED)
- **Feature 7**: Incremental chronological balance propagation using SQLite rowid ordering, including database user_version migrations for backward compatibility. (COMPLETED)
- **Feature 8**: Robust Date and Time parsing during CSV/Excel imports (correctly handling Excel numeric serial time values and strict JS engine date strings). (COMPLETED)
- **Feature 9**: Async chunked CSV/Excel batch imports with progress tracking overlay and background local push notifications. (COMPLETED)
- **Feature 10**: Double skeleton loader fix (disabling loading display on background cloud syncs) and infinite scroll lazy pagination. (COMPLETED)
- **Feature 11**: Clipboard paste shortcut icon inside the raw JSON backup restore modal. (COMPLETED)
- **Feature 12**: Bulk transaction entry options implemented: "Save & Add Another", "Duplicate Transaction" via long-press, and "Quick Add Templates". (COMPLETED)
- **Feature 13**: App Shortcut "Quick Add" for zero-app-open staging of transactions, using an 'uncategorized' SQLite placeholder and a transparent modal UI. (COMPLETED)

- **Feature 14**: Redesigned Quick Add UI to a solid, full-screen opaque modal instead of a transparent overlay. (COMPLETED)
- **Feature 15**: Quick Add keyboard UX improvements (Enter-key forwarding, instant OS-level exit via hardware back gesture) and resolved soft-deleted offline SQLite ghost records bug. (COMPLETED)
- **Feature 16**: Zero-friction Quick Add cold start architecture. Bypassed initial `index` tab routing and dropped the Expo Splash Screen instantly to achieve sub-second launch times for the Quick Action intent. (COMPLETED)
- **Feature 17**: Custom Expo Config Plugin (`withAndroidDrawable`) to automatically compile `assets/ic_quick_add.png` into a WebP drawable resource during prebuild using Node `sharp`. (COMPLETED)
- **Feature 18**: Add a new category for "Suspicious UPI Deductions" and exclude 'Uncategorized' transactions from global balance calculations. (COMPLETED)
- **Feature 19**: Overhauled "Backdated Mode" math logic to inversely adjust the Account's initial baseline balance (e.g. adding a backdated debit *increases* the baseline balance) so the user's *current* real-world balance remains perfectly accurate when logging historical gaps. (COMPLETED)
- **Feature 20**: Added a scaling size controller to `android-icon-foreground.svg` via `viewBox`-centered CSS `transform` groups, allowing mathematically perfect resizing of the adaptive icon directly from the SVG source without breaking Expo/Sharp rasterization. (COMPLETED)
- **Feature 21**: Re-integrated Quick Add cold start into the main `RootLayoutNav` tree so it loads exactly like main tabs (with Splash Screen, Auth, and Redux loading) while still trapping the user in the Quick Add modal. Ensured the Close button calls `BackHandler.exitApp()` only when directly launched from the Quick Action. (COMPLETED)
- **Feature 22**: Re-routed Quick Add "Open LedgerLite" button to go directly to the `/(tabs)/transactions` screen instead of indiscriminately popping open the `AddTransactionSheet` overlay, streamlining data entry workflow. (COMPLETED)
- **Feature 23**: Completely removed the Quick Add feature, along with its associated Redux state (`isQuickAddEscaped`), routes, and QuickAction listener logic, as per user request. (COMPLETED)
- **Feature 24**: Executed a massive architectural refactor to dismantle the "feature-based" structure in favor of a flat, standardized layered architecture (`components`, `hooks`, `server`, `store`, `utils`). Successfully migrated and resolved hundreds of import paths across tests and source files with zero compile errors. (COMPLETED)
- **Feature 25**: Segregated Top-Level Screens from generic Components. Moved full-page container components (e.g. `Login`, `TransactionsTab`, `Analytics`) from `src/components/` to `src/screens/` and re-linked them dynamically to the Expo Router (`src/app/`). This finalizes a strict domain separation in the layered architecture. (COMPLETED)
- **Feature 26**: UI Decomposition Phase. Extracted complex business logic out of `DataManagementSection.tsx` into specialized hooks (`useDataExport`, `useDataImport`, `useDataSync`, `useDataBackup`). Decomposed `CategoryEditSheet.tsx` by extracting monolithic PanResponder gesture logic into `icon-selector.tsx` and `color-selector.tsx`. Decomposed `CustomDateTimePickerModal.tsx` into `time-picker-wheels.tsx` and `date-picker-calendar.tsx`. Decomposed `AddTransactionSheet.tsx` into `amount-input.tsx`, `transaction-type-tabs.tsx`, and `transaction-metadata-form.tsx`. Decomposed `login.tsx` and `register.tsx` by extracting reusable `auth-header.tsx`, `auth-footer.tsx`, and `auth-divider.tsx`. Enforced `kebab-case.tsx` globally across all components and screens. (COMPLETED)

# Current Progress Update (July 12, 2026)
- **Crash Fix Session (July 12, 2026)**: Full crash diagnosis and 3-bug fix sprint on branch `feature/android-crash-fix`, merged to `dev`.
  - **Bug 1 (CRASH - Critical)**: `DatabaseProvider` was calling `useAuth()` hook (which requires `AuthProvider` in the component tree). In the Quick Add shortcut path, the app renders `QuickAddOnlyLayout` → `DatabaseProvider` WITHOUT `AuthProvider`, causing the hook to read from an undefined context and crash. **Fix**: Replaced `useAuth()` with raw `useContext(AuthContext)` and exported `AuthContext` from `AuthContext.tsx`. With a proper default context value (`{ user: null, isLoading: true }`), the provider gracefully falls back to `ledgerlite_guest.db` when used outside `AuthProvider`.
  - **Bug 2 (LOGIC - Silent Data Loss)**: `TransactionSchema` in `validation.ts` had `type: z.enum(["income", "expense", "transfer"])` but the SQLite DB stores `"credit" | "debit"`. Every cloud-pulled transaction silently failed Zod validation in `syncService.ts` and was skipped, breaking cloud sync for all transactions.
  - **Bug 3 (LOGIC - Silent Data Loss)**: `CategorySchema` required `type` and `is_default` fields that do not exist in the SQLite schema or `Category` TypeScript type. Every pulled category was silently skipped during pull.
  - **Bug 4 (LOGIC)**: `AccountSchema` allowed `"Wallet"` as an account type which is not in the domain model. Aligned to `"Cash" | "Bank" | "Credit Card"`.
  - `npx tsc --noEmit` → **0 errors** on `dev` after all fixes.
- **Dependency Crash Fix Session (July 12, 2026)**:
  - **Bug 5 (CRASH - AndroidRuntime AnyTypeCache)**: `java.lang.NoClassDefFoundError: Failed resolution of: Lexpo/modules/kotlin/types/AnyTypeCache`. The app was using `expo-asset@57.0.3` which was severely incompatible with Expo SDK 54. Fixed by running `npx expo install --fix` to downgrade it back to `~12.0.13`, aligning native modules and resolving the startup crash.

- **Routing Fix Session (July 12, 2026)**:
  - **Bug 6 (LOGIC - Login Loop)**: Clicking "Log In" from the onboarding screen re-routed the user back to onboarding immediately. The `useProtectedRoute` hook was aggressively redirecting any route that wasn't `onboarding` back to `onboarding` if `hasCompletedOnboarding` was false, including the `(auth)` group. **Fix**: Updated `useProtectedRoute` to allow navigation to the `(auth)` group even when onboarding is not yet completed.

- **Legacy Firebase Bridge Session (July 12, 2026)**:
  - **Bug 7 (LOGIC - Missing Old Data)**: Old transactions saved in Firebase under the legacy `"expenses"` collection were being ignored by the new synchronization engine, which only pulled from the `"transactions"` collection. **Fix**: Updated `pullFromFirebase` in `syncService.ts` to actively query both `"transactions"` and `"expenses"` collections, parsing old `"expenses"` documents into the new `Transaction` interface and saving them. The next cloud push automatically migrates these records into the new `"transactions"` collection, resolving the data fragmentation seamlessly.

- **Background Sync Crash Fix (July 12, 2026)**:
  - **Bug 8 (CRASH - Unhandled Promise Rejection)**: `Call to function 'NativeDatabase.prepareAsync' has been rejected. Caused by: Access to closed resource`. When a guest user adds a transaction, a 3-second background push timeout is scheduled via `SyncService.schedulePush`. If the user logs in before the timeout fires, `DatabaseProvider` remounts and natively closes the `ledgerlite_guest.db` connection. When the timeout eventually executes, the unmounted closure attempts to query the closed database, throwing an error. Because the `setTimeout` callback lacked a `try/catch` block, this bubbled into a fatal Unhandled Promise Rejection. **Fix**: Wrapped the `pushToFirebase` call inside `schedulePush` in a `try/catch` block to swallow and warn on aborted background syncs, and updated `resetSyncState` to proactively `clearTimeout(syncTimeout)` when the authentication state changes.

- **Quick Add Exit Loop Fix (July 12, 2026)**:
  - **Bug 9 (LOGIC - Stale Action Loop)**: After closing the app from Quick Add via `BackHandler.exitApp()`, the next time the app was launched normally, it would immediately re-open Quick Add. **Fix**: Replaced the global `QuickActions.initial` context check with a `lastProcessedQuickAction` instance tracking variable and an `isDirect` search parameter (`/quick-add?isDirect=true`). This guarantees a Quick Action is only processed exactly once, breaking the stale intent loop.
  - **Bug 10 (CRASH - GO_BACK unhandled)**: `The action 'GO_BACK' was not handled by any navigator.` When Expo Router's automatic Quick Actions deep linking intercepts the intent, it pushes `/quick-add` without our `isDirect=true` parameter. Because it was handled as a deep link, the router history stack was completely empty, causing `router.back()` to crash. **Fix**: Updated `QuickActions.setItems` href to strictly inject `?isDirect=true`, and fortified `QuickAdd.tsx` with a `router.canGoBack()` safeguard (falling back to `router.replace("/")` if the stack is empty).
