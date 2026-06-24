# 2.0.3

### Features
- **PDF Export with Visualizations:** Implemented HTML-to-PDF export functionality that generates a comprehensive expense report with date filtering and a dynamically rendered CSS pie chart of category spending.
- **Improved Analytics Loading:** Decoupled SQLite data fetching in the Analytics tab. The "Total Spent" metric now renders instantly on tab switch, while the category Pie Chart utilizes a high-quality 600ms skeleton loader when date filters are explicitly changed or on cold boot.

### Security & Performance
- **Firebase Sync Rate Limiting:** Implemented a strict 10-second cooldown in `SyncService` to prevent aggressive sync attempts from abusing Firestore quotas.
- **Multiple Sign-in Prevention:** Hardened the Login and Register screens using synchronous `useRef` locks to completely block multiple parallel Firebase Auth requests caused by rapid button tapping.
- **Hot-Reload Sync Optimization:** Decoupled the background sync engine from the React component lifecycle in the root layout. It now correctly respects the JavaScript memory boundary to ensure cloud syncs only fire on a true application cold-boot, preventing redundant network requests during Metro fast-refresh.

### Bug Fixes
- **Time Picker Keyboard Jitter:** Fixed a critical UX bug in the `CustomDateTimePickerModal` where transitioning from the 'hour' to 'minute' input field would cause the software keyboard to abruptly dismiss and reappear.
- **Modal Gesture Conflicts:** Reverted experimental swipe-to-close PanResponder behaviors in `ColumnSelectionModal` that were conflicting with internal ScrollView responders and causing UI freezes on Android.

