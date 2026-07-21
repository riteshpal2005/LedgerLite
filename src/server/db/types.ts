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
  destinationAccountId?: string;
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
  current_balance?: number;
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
  markMultipleAsSynced(updates: {id: string;table: "transactions" | "categories" | "accounts";}[]): Promise<void>;
  getPendingSyncData(): Promise<{pendingTransactions: Transaction[];pendingCategories: Category[];pendingAccounts: Account[];}>;
}

export async function initializeDatabase(db: any) {
  try {

    await db.execAsync(`ALTER TABLE accounts ADD COLUMN current_balance REAL;`);
  } catch (e) {

  }
}