# LedgerLite Security Policy

The LedgerLite team takes the security of our application and user data seriously. As an expense tracking platform, protecting sensitive financial user data—both locally on the mobile device and during synchronization with remote servers—is a top priority.

This document outlines supported software versions, instructions for reporting security vulnerabilities responsibly, and our core security architecture safeguards.

## Table of Contents
- [Supported Versions](#supported-versions)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
  - [Reporting Steps](#reporting-steps)
  - [What to Include](#what-to-include)
  - [Response Expectations & SLA](#response-expectations--sla)
- [Security Architecture & Threat Controls](#security-architecture--threat-controls)
  - [1. Mobile Client (React Native / Expo)](#1-mobile-client-react-native--expo)
  - [2. Firebase Backend & Authentication](#2-firebase-backend--authentication)
  - [3. Local Persistence (WatermelonDB)](#3-local-persistence-watermelondb)
- [Incident Handling & Disclosure Lifecycle](#incident-handling--disclosure-lifecycle)
- [Developer & Contributor Security Hygiene](#developer--contributor-security-hygiene)

## Supported Versions
We actively release security patches and dependency updates for the following software versions:

| Version | Supported | Maintenance Status |
|---------|-----------|--------------------|
| **v1.x.x** (Main / Latest) | 🟢 Yes | Active development and priority security updates |
| **< v1.0.0** (Alpha/Beta) | 🔴 No | Deprecated. Users should upgrade to latest v1.x |

## Reporting a Vulnerability
If you discover a security vulnerability, security flaw, or potential weakness in LedgerLite, please **do not open a public GitHub issue**. Publicly disclosing security flaws puts active users at risk before a fix can be prepared and deployed.

### Reporting Steps
Please report security issues privately using one of the following methods:
- **GitHub Private Vulnerability Reporting**: Navigate to the repository's *Security* tab, click *Report a vulnerability*, and fill out the private disclosure form.
- **Email Disclosure**: Send an email directly to our security maintainers with the subject line: `[SECURITY] Vulnerability Report - <Brief Summary>`.

### What to Include
To help us investigate and remediate the issue quickly, please include as much detail as possible:
- **Type of Issue**: (e.g., Unauthenticated database rules, Firebase token leakage, Insecure Local Storage).
- **Affected Component**: Mobile App, Firebase Rules, Local Database, or Build Script.
- **Steps to Reproduce**: Step-by-step instructions or proof-of-concept (PoC) code/scripts.
- **Potential Impact**: What data, operations, or accounts could be compromised?
- **Suggested Remediation**: Any recommended code changes or configuration fixes (if known).

### Response Expectations & SLA
- **Initial Acknowledgment**: Within 24 to 48 hours of receiving your report.
- **Triage & Assessment**: Within 5 business days, detailing validity and severity rating.
- **Patch Target**: Critical vulnerabilities aim to be patched within 14 calendar days; non-critical flaws within 30 calendar days.

## Security Architecture & Threat Controls
LedgerLite employs a defense-in-depth approach spanning the mobile frontend, local data persistence, and remote Firebase services.

### 1. Mobile Client (React Native / Expo)
- **Credential Storage**: Authentication tokens provided by Firebase are managed securely by the Firebase SDK. Any additional sensitive configuration data is stored using Expo SecureStore.
- **Console Log Stripping**: All `console.log` statements containing potentially sensitive payload outputs are automatically stripped in production release builds.
- **Transport Security**: All network communications (including Firebase syncing) enforce HTTPS (TLS). HTTP connections are rejected in production builds.

### 2. Firebase Backend & Authentication
- **Authentication**: LedgerLite relies on Firebase Authentication to securely manage user identities, utilizing robust token generation and secure session management.
- **Security Rules**: Access to the remote Firebase Firestore/Realtime Database is protected using strict Firebase Security Rules to ensure users can only read and write their own data.
- **Rate Limiting & Abuse Prevention**: We utilize built-in Firebase App Check and rate-limiting measures to prevent automated abuse and brute-force attacks.

### 3. Local Persistence (WatermelonDB)
- **Data Isolation**: Local user data is managed through WatermelonDB (backed by SQLite). Data is isolated to the application sandbox provided by iOS and Android operating systems.
- **State Management**: Redux Toolkit manages application state in-memory safely, and sensitive session data is cleared upon user logout.

## Incident Handling & Disclosure Lifecycle
When a security vulnerability is reported or identified:
1. **Verification**: Maintainers isolate the affected code paths in a private workspace.
2. **Fix Development**: A security patch is created, tested against existing Jest test suites, and verified against regression.
3. **Release Deployment**: A hotfix release is published (`v1.x.y`) for Expo updates and mobile App Store/Play Store builds.
4. **Public Advisory**: After a patch is deployed and verified, a GitHub Security Advisory is published summarizing the issue, severity, fix, and credit to the reporter (if desired).

## Developer & Contributor Security Hygiene
All project contributors must adhere to these baseline security habits:
- **Never Commit Secrets**: Firebase service accounts, API keys, and private keys must never be committed to Git. Always use `.env` files and verify they are listed in `.gitignore`.
- **Automated Secret Scanning**: We recommend installing `gitleaks` or `trufflehog` locally to prevent accidental credential commits.
- **Dependency Auditing**: Run `npm audit` periodically on the project directory. High or critical severity vulnerabilities must be updated or overridden immediately.
- **PR Code Reviews**: All pull requests targeting `main` or `dev` require approval from at least one core maintainer, checking specifically for input validation and privilege escalation risks.

Thank you for helping keep LedgerLite secure for all users!
