import { SQLiteDatabase } from "expo-sqlite";

export type TransactionType = "credit" | "debit";

export type SyncStatus = "pending" | "synced" | "deleted";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: number;
  type: TransactionType;
  categoryId: string;
  merchant?: string;
  accountId?: string;
  balance_after?: number;
  linkedTransactionId?: string;
  sync_status: SyncStatus;
  updated_at: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  sync_status: SyncStatus;
  updated_at: number;
}

export interface Account {
  id: string;
  name: string;
  type: "Cash" | "Bank" | "Credit Card";
  balance: number;
  sync_status: SyncStatus;
  updated_at: number;
}

export interface AccountWithBalance extends Account {
  currentBalance?: number;
}

export interface ImportedTransaction {
  id: string;
  amount: number;
  description: string;
  merchant: string | null;
  date: number;
  type: "credit" | "debit";
  categoryId: string;
  accountId?: string;
  _accountName?: string;
}

export interface DatabaseActions {
  getAllTransactions(): Promise<Transaction[]>;
  getAllCategories(): Promise<Category[]>;
  getAllAccounts(): Promise<Account[]>;
  restoreTransaction(t: Transaction): Promise<void>;
  restoreCategory(c: Category): Promise<void>;
  restoreAccount(a: Account): Promise<void>;
  deleteCorruptedData(): Promise<void>;
  markMultipleAsSynced(updates: { id: string; table: "transactions" | "categories" | "accounts" }[]): Promise<void>;
}

export const CREATE_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    sync_status TEXT DEFAULT 'pending',
    updated_at INTEGER
  );
`;

export const CREATE_ACCOUNTS_TABLE = `
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0,
    sync_status TEXT DEFAULT 'pending',
    updated_at INTEGER
  );
`;

export const CREATE_TRANSACTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    description TEXT,
    date INTEGER NOT NULL,
    categoryId TEXT NOT NULL,
    type TEXT NOT NULL,
    merchant TEXT,
    accountId TEXT,
    balance_after REAL,
    linkedTransactionId TEXT,
    sync_status TEXT DEFAULT 'pending',
    updated_at INTEGER
  );
`;

export const CREATE_TRANSACTIONS_DATE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
`;

export const CREATE_TRANSACTIONS_CATEGORY_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_transactions_categoryId ON transactions(categoryId);
`;

export const CREATE_TRANSACTIONS_ACCOUNT_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_transactions_accountId ON transactions(accountId);
`;

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(CREATE_ACCOUNTS_TABLE);
  await db.execAsync(CREATE_CATEGORIES_TABLE);
  await db.execAsync(CREATE_TRANSACTIONS_TABLE);

  await db.execAsync(CREATE_TRANSACTIONS_DATE_INDEX);
  await db.execAsync(CREATE_TRANSACTIONS_CATEGORY_INDEX);
  await db.execAsync(CREATE_TRANSACTIONS_ACCOUNT_INDEX);

  const versionResult = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  const version = versionResult?.user_version || 0;

  if (version < 2) {
    await db.execAsync("PRAGMA user_version = 2;");
    try {
      await db.execAsync("ALTER TABLE transactions ADD COLUMN balance_after REAL;");
    } catch (e: any) {
      if (!e.message?.includes('duplicate column name')) throw e;
    }

    const accounts = await db.getAllAsync<{ id: string; balance: number }>(
      "SELECT id, balance FROM accounts"
    );

    for (const account of accounts) {
      const accountTransactions = await db.getAllAsync<{ id: string; amount: number; type: string }>(
        "SELECT id, amount, type FROM transactions WHERE accountId = ? AND sync_status != 'deleted' ORDER BY date ASC, rowid ASC",
        [account.id]
      );

      let runningBalance = account.balance || 0;
      for (const transaction of accountTransactions) {
        if (transaction.type === "credit") {
          runningBalance += transaction.amount;
        } else if (transaction.type === "debit") {
          runningBalance -= transaction.amount;
        }

        await db.runAsync(
          "UPDATE transactions SET balance_after = ?, sync_status = ?, updated_at = ? WHERE id = ?",
          [runningBalance, "pending", Date.now(), transaction.id]
        );
      }
    }
  }

  if (version < 3) {
    try {
      await db.execAsync("ALTER TABLE transactions ADD COLUMN linkedTransactionId TEXT;");
    } catch (e: any) {
      if (!e.message?.includes('duplicate column name')) console.warn(e);
    }
    await db.execAsync("PRAGMA user_version = 3;");
  }

  const defaultTime = Date.now();
  await db.execAsync(`
    INSERT OR IGNORE INTO categories (id, name, icon, color, sync_status, updated_at) VALUES 
    ('cat-1', 'Food & Dining', 'fast-food', '#f43f5e', 'synced', ${defaultTime}),
    ('cat-2', 'Shopping', 'mdi-shopping', '#3b82f6', 'synced', ${defaultTime}),
    ('cat-3', 'Transportation', 'bus', '#eab308', 'synced', ${defaultTime}),
    ('cat-4', 'Entertainment', 'tv', '#a855f7', 'synced', ${defaultTime}),
    ('cat-5', 'Bills', 'mdi-file-document-outline', '#10b981', 'synced', ${defaultTime}),
    ('cat-6', 'Self Transfer', 'mdi-bank-transfer', '#6366f1', 'synced', ${defaultTime}),
    ('cat-7', 'Withdraw', 'mdi-cash-multiple', '#10b981', 'synced', ${defaultTime}),
    ('cat-8', 'Medicine', 'mdi-pill', '#ec4899', 'synced', ${defaultTime}),
    ('cat-9', 'Grocery', 'basket', '#f97316', 'synced', ${defaultTime}),
    ('cat-10', 'Salary', 'cash', '#22c55e', 'synced', ${defaultTime}),
    ('cat-11', 'Investment', 'mdi-piggy-bank', '#6366f1', 'synced', ${defaultTime}),
    ('cat-12', 'Allowance', 'mdi-hand-coin', '#eab308', 'synced', ${defaultTime}),
    ('cat-13', 'Friend', 'mdi-handshake', '#6366f1', 'synced', ${defaultTime}),
    ('cat-14', 'Utilities', 'mdi-sim', '#06b6d4', 'synced', ${defaultTime}),
    ('cat-15', 'Bank Deductions', 'mdi-alert-circle', '#ef4444', 'synced', ${defaultTime}),
    ('uncategorized', 'Uncategorized', 'help', '#9ca3af', 'synced', ${defaultTime});
  `);
}
