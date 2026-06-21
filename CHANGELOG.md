# LedgerLite Initial Release (v1.2.0)

This marks the first official, consolidated release of LedgerLite. LedgerLite is engineered as an offline-first, highly performant personal finance management application built on React Native and Expo. 

Below is the comprehensive technical and feature breakdown of the application architecture from inception to the current build.

## Core Architecture & Performance
* **Offline-First Database:** Powered by Expo SQLite, ensuring immediate read/write operations without network latency. The local database serves as the absolute single source of truth.
* **State Management:** Integrated Redux Toolkit (RTK) for complex, global state synchronization across components, combined with React Context API for localized theme and preference states.
* **Performant UI:** Engineered using `@shopify/flash-list` for smooth, 60fps scrolling performance on large transaction histories.
* **Styling Engine:** Utilizes NativeWind for strict, consistent design token enforcement and dynamic Dark/Light mode support.

## Expense & Transaction Management
* **Multi-Account Support:** Create and manage multiple financial accounts (wallets, bank accounts, credit cards) with distinct initial balances and running totals.
* **Dynamic Categorization:** Fully customizable category system. Users can create, edit, and assign specific colors and icons to categories for visual grouping.
* **Transaction Lifecycle:** Comprehensive CRUD operations for income and expenses.
* **Relational Data Integrity:** Deleting accounts or categories prompts the user with intelligent cascading options (e.g., safely reassigning orphaned transactions to a different account/category).
* **Advanced Filtering:** Multi-dimensional sorting and filtering bottom sheet to query transactions by date range, type, category, or account.

## Data Interoperability & Export
* **Spreadsheet Export:** Generate and export financial records directly to Excel (.xlsx) or CSV formats using the native file system.
* **PDF Reports:** Generate structured, formatted PDF reports of transaction history using `expo-print`.
* **JSON Portability:** Export complete application state (Settings, Categories, Accounts, Transactions) to raw JSON.
* **Smart Data Import:** Import data from external spreadsheets or raw JSON files. The import engine utilizes a "Smart Merge" algorithm to deduplicate transactions based on timestamp, amount, and description thresholds.

## Cloud Synchronization (Firebase)
* **Dual-Sync Engine:** Integrated Firebase Firestore to act as a secondary, cloud-based snapshot of the local SQLite database.
* **Authentication:** Secure user isolation via Firebase Authentication.
* **Smart Cloud Restore:** Restoring from the cloud performs a non-destructive merge. The engine compares cloud payloads against local SQLite records to import new data while skipping existing duplicates, preserving local data integrity.

## Security & Reliability
* **Native Overlays:** All critical destructive actions (deleting accounts, categories, transactions) are guarded by robust native Modals to prevent accidental data loss and UI gesture conflicts.
* **Automated CI/CD:** Complete integration with GitHub Actions to automatically securely sign, build, and deploy `arm64-v8a` Android APKs upon version tagging.
