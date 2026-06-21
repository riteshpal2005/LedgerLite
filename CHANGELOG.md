# v1.3.0

## Cloud Sync & Authentication (Offline-First)
* **Firebase Integration:** Built a robust Firebase backend integration (`config.ts`, `AuthContext.tsx`) enabling full cloud synchronization.
* **Authentication Flows:** Added secure Email/Password and Google OAuth login/registration screens with router-level authentication guards.
* **Dual Sync Engine:** Implemented a conflict-free, offline-first sync engine (`syncService.ts`) that queues local operations and pushes them in batches when the network is available.
* **Cloud Backup & Restore:** Users can now manually backup their entire financial history to Firestore and restore it seamlessly on new devices.

## Database & Architecture Overhaul
* **UUID Migration:** Completely migrated the SQLite database schema from auto-incremented integers to robust string UUIDs (`id TEXT`) to prevent primary key collisions during multi-device sync.
* **Sync States:** Introduced `sync_status` (`pending`, `synced`, `deleted`) and `updated_at` tracking on all SQLite records to intelligently manage differential syncs.
* **Redux Refactor:** Extensively updated Redux slices and components to strongly enforce `string` type IDs across the entire application hierarchy.

## UI Components & Polish
* **Atomic Design System:** Abstracted out reusable foundational UI components to improve consistency and maintainability across the app.
* **Data Management UI:** Overhauled the Data Management section in settings to gracefully handle the new cloud sync workflows alongside existing local exports.



