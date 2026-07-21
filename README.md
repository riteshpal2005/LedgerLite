# LedgerLite — Offline-First Personal Finance Tracker

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> **Note:** This is an independent learning project engineered from the ground up to demonstrate production-grade mobile architecture. It focuses heavily on **Offline-First Data Persistence, High-Performance List Rendering, and Complex Dual-Sync Cloud Algorithms.**

LedgerLite is a high-performance, offline-first personal finance management application. It allows users to track expenses, manage multiple localized wallets, categorize transactions dynamically, and securely synchronize their local databases to the cloud via a custom Smart Merge engine.

## Table of Contents
- [UI Showcase](#ui-showcase)
- [Key Features](#key-features)
- [System Architecture & Stack](#system-architecture--stack)
- [Engineering Philosophy: Architecture Deep Dive](#engineering-philosophy-architecture-deep-dive)
- [Performance Optimizations](#performance-optimizations)
- [Project Directory Overview](#project-directory-overview)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [CI/CD Automated Deployment](#cicd-automated-deployment)
- [Documentation & Related Resources](#documentation--related-resources)
- [License & Contributions](#license--contributions)
- [Connect with the Developer](#connect-with-the-developer)

## UI Showcase

<p align="center">
  <img src="./assets/screenshots/analytics.webp" width="23%" />
  <img src="./assets/screenshots/add-expense.webp" width="23%" />
  <img src="./assets/screenshots/date-picker.webp" width="23%" />
  <img src="./assets/screenshots/time-picker.webp" width="23%" />
</p>

<p align="center">
  <img src="./assets/screenshots/category-picker.webp" width="23%" />
  <img src="./assets/screenshots/account-picker.webp" width="23%" />
  <img src="./assets/screenshots/settings.webp" width="23%" />
  <img src="./assets/screenshots/expenses.webp" width="23%" />
</p>

## Key Features
- 📱 **Offline-First by Design**: The local device is the absolute source of truth. Completely functional without an internet connection, ensuring zero network latency.
- 💼 **Multi-Account & Wallet Tracking**: Create infinite custom accounts (Checking, Savings, Cash). Each account maintains its own isolated running balance.
- 🔄 **Dual-Sync Cloud Backup & Smart Merge**: Opt into Firebase Authentication to sync your SQLite database to the cloud. Restoring utilizes a custom Smart Merge algorithm to surgically inject missing records and skip duplicates.
- 🔍 **Advanced Multi-Dimensional Filtering**: Search fuzzily by description or filter through complex multi-dimensional queries (date ranges, Income vs. Expense, and exact categories).
- 💾 **Complete Data Portability**: SQLite database can be instantly exported locally as a Raw JSON backup, an Excel (`.xlsx`) spreadsheet, or a CSV file for desktop analysis.
- 🎨 **Strict NativeWind Theme Engine**: Instantaneous, flawless transitions between Light Mode and Dark Mode across the entire application without frame drops, powered by Tailwind CSS.

## System Architecture & Stack

| Domain | Technology | Key Libraries / Rationale |
|--------|------------|----------------------------|
| **Framework** | React Native & Expo | Fast iteration speed; direct access to native APIs via continuous prebuilding. |
| **Language** | TypeScript (Strict) | Enforced compile-time safety across complex relational database queries and Redux slices. |
| **Local Database** | `expo-sqlite` / WatermelonDB | Eliminated network latency by providing a highly robust, on-device relational data layer. |
| **Cloud Backing**| Firebase & Firestore | Seamless Google OAuth integration and secure NoSQL cloud document storage for data backups. |
| **State Mgt.** | Redux Toolkit | Handled the massive aggregation logic required to calculate net worth across multiple SQLite tables. |
| **Styling** | NativeWind | Rapid, design-system-driven UI development using Tailwind classes mapped directly to native styling. |
| **Rendering** | `@shopify/flash-list` | Prevented JS-thread blocking by recycling list views, ensuring 60FPS scrolling on massive lists. |

## Engineering Philosophy: Architecture Deep Dive

The architectural goal of LedgerLite was to avoid the "Loading Spinner" anti-pattern prevalent in modern React Native applications. By utilizing the local device as the absolute Source of Truth, all network-bound state management is eliminated from the critical user path.

### 1. Database Schema & Relational Integrity
The local data layer is powered by `expo-sqlite`. To maintain strict referential integrity when users delete Accounts or Categories, the database utilizes relational mappings.

![LedgerLite Architecture Diagram](./assets/images/architecture-diagram.webp)

### 2. State Management Segregation
I chose **Redux Toolkit (RTK)** to manage the highly relational, globally accessed transaction data, but deliberately isolated UI state (Themes, Preferences) into **React Context**. 
- **Why?** Passing static theme data through Redux causes unnecessary subscriber evaluations across the entire component tree. Isolating static state into Context prevents render cycles on the massive FlashList components when UI toggles occur.

### 3. The Dual-Sync "Smart Merge" Engine
When a user decides to back up their data, the app pushes the SQLite snapshot to Firebase Firestore. The complexity arises during **Restoration**. If a user has been using the app offline on a new device, a blind cloud-restore would overwrite their new local data.

To solve this, I engineered a **Smart Merge Algorithm**:
```typescript
// Conceptual Snippet of the Merge Logic
const restoreFromCloud = async (cloudExpenses) => {
  const localExpenses = await getLocalExpenses();
  
  for (const cloudExp of cloudExpenses) {
    // 1. Check for exact UUID matches
    const exists = localExpenses.find(e => e.id === cloudExp.id);
    
    // 2. Fuzzy Deduplication (Protects against un-synced UUIDs)
    const isDuplicate = localExpenses.some(local => 
      local.amount === cloudExp.amount &&
      local.description === cloudExp.description &&
      Math.abs(local.date - cloudExp.date) < 60000 // 1-minute fuzzy threshold
    );

    if (!exists && !isDuplicate) {
      await insertIntoSQLite(cloudExp);
    }
  }
}
```

## Performance Optimizations
- **`@shopify/flash-list` over `FlatList`:** As financial transactions grow into the thousands, React Native's default `FlatList` suffers from JS thread bottlenecking and blank space rendering. `FlashList` recycles views under the hood (similar to Android's `RecyclerView`), keeping the app locked at 60FPS regardless of list size.
- **Native Modals over Bottom Sheets for Destructive Actions:** During early development, complex bottom sheets used for deleting accounts caused UI tearing and gesture lockups when stacked. I refactored the architecture to delegate all critical destructive workflows (Confirm Deletions) to OS-level Native Modals, completely bypassing the React Native gesture responder system for flawless reliability.
- **Premium Micro-Animations:** Replaced standard component mounts on the Authentication screens with `react-native-reanimated`. I utilized staggered `FadeInDown.springify()` cascades to load UI groups. Because Reanimated runs animations directly on the UI thread, it guarantees no frame drops while the JS thread parses the heavy Firebase SDK in the background.

## Project Directory Overview
```text
src/
├── app/                      # Expo Router file-based routing
│   ├── (auth)/               # Authentication stack (login.tsx, register.tsx)
│   ├── (tabs)/               # Main application tabs (index.tsx, analytics.tsx, settings.tsx)
│   ├── categories.tsx        # Custom category management screen
│   ├── backdated.tsx         # Screen for adding historical expenses
│   └── _layout.tsx           # Root layout provider (Redux & Context injection)
│
├── core/                     # Global infrastructure & integrations
│   ├── database/             # SQLite schema and useExpenseDatabase hook
│   ├── firebase/             # Firebase config and AuthContext listener
│   ├── services/             # Abstractions (authService, dataService, syncService)
│   ├── store/                # Redux Toolkit configuration & Slices
│   ├── theme/                # NativeWind Context & dynamic color tokens
│   └── utils/                # Utility wrappers (e.g., expo-haptics)
│
├── features/                 # Domain-driven feature slices
│   ├── accounts/             # Wallets, Banks, Account UI, and Deletion Modals
│   ├── analytics/            # SQLite aggregation queries and PieCharts
│   ├── categories/           # Category creation logic and Color/Icon pickers
│   ├── expenses/             # Transaction CRUD, FlashLists, and Filters
│   └── settings/             # Cloud Sync, JSON Exports, and App Preferences
│
└── shared/                   # Reusable cross-domain UI primitives
    └── components/           # CustomAlerts, PrimaryButtons, FormFields
```

## Prerequisites
Ensure your local development workstation has the following installed:
- **Node.js**: v18.x or higher
- **Package Manager**: npm or yarn
- **Expo CLI**: `npm install -g expo-cli`
- **Mobile Environment**:
  - **Android**: Android Studio with configured SDK and active emulator.
  - **iOS** (macOS only): Xcode and iOS Simulator.

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/riteshpal2005/LedgerLite.git
   cd LedgerLite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server:**
   ```bash
   npx expo start
   ```

## CI/CD Automated Deployment
LedgerLite utilizes a strict **GitHub Actions** pipeline to automate the delivery of Android binaries, ensuring the main branch is always in a releasable state.
- **Trigger:** Git Tagging (`v*.*.*`)
- **Pipeline:** Provisions an Ubuntu environment, configures Node 24 and Java 17, automatically reconstructs the `.env` and `release.keystore` from encrypted GitHub Secrets, and executes `./gradlew assembleRelease`.
- **Delivery:** Attaches the compiled `arm64-v8a` APK artifact directly to a GitHub Release, pulling dynamic release notes from `CHANGELOG.md`.

## Documentation & Related Resources
For full technical specifications, database schemas, and contribution standards, refer to the following repository documents:
- 🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Git branching policies, Conventional Commit conventions, pull request rules, and coding standards.
- 🔐 **[SECURITY.md](./SECURITY.md)**: Core security architecture, disclosure protocols, and secure storage implementation details.
- 📝 **[CHANGELOG.md](./CHANGELOG.md)**: Historical record of updates, features, and bug fixes following Semantic Versioning.

## License & Contributions
LedgerLite is released under the MIT License. For a plain-language summary of your rights and obligations, please see the [LICENSE.md](./LICENSE.md) file. Contributions, bug reports, and feature requests are welcome! Please read `CONTRIBUTING.md` before submitting Pull Requests.

## Connect with the Developer
Built by **Ritesh Pal**  
I am actively seeking software engineering opportunities where I can solve complex architectural problems. Let's connect!

<div align="left">
  <a href="https://github.com/riteshpal2005">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/riteshpal2005">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://riteshpal.dev/">
    <img src="https://img.shields.io/badge/Portfolio-2563EB?style=for-the-badge&logo=react&logoColor=white" alt="Portfolio" />
  </a>
  <a href="mailto:riteshks211@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</div>
