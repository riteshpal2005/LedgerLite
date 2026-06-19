import { SQLiteDatabase } from 'expo-sqlite';


export type TransactionType = 'credit' | 'debit';

export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: number;
  type: TransactionType;
  categoryId: number;
  merchant?: string;
  accountId?: number; // Ref: schema-2
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Account {
  id: number;
  name: string;
  type: 'Cash' | 'Bank' | 'Credit Card';
  balance: number; // This acts as the Initial Balance in DB
  currentBalance?: number; // Dynamically calculated Current Balance
}

export const CREATE_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT
  );
`;

export const CREATE_ACCOUNTS_TABLE = `
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0
  );
`;

export const CREATE_EXPENSES_TABLE = `
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    description TEXT,
    date INTEGER NOT NULL,
    categoryId INTEGER NOT NULL,
    type TEXT NOT NULL,
    merchant TEXT
  );
`;

export const CREATE_EXPENSES_DATE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
`;

export const CREATE_EXPENSES_CATEGORY_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_expenses_categoryId ON expenses(categoryId);
`;

export async function initializeDatabase(db: SQLiteDatabase) {
  // Ref: schema-1
  await db.execAsync(CREATE_ACCOUNTS_TABLE);
  await db.execAsync(CREATE_CATEGORIES_TABLE);
  await db.execAsync(CREATE_EXPENSES_TABLE);

  await db.execAsync(CREATE_EXPENSES_DATE_INDEX);
  await db.execAsync(CREATE_EXPENSES_CATEGORY_INDEX);

  // Ref: schema-3
  try {
    await db.execAsync(`ALTER TABLE expenses ADD COLUMN accountId INTEGER;`);
  } catch (error) {
    // Column likely already exists, safe to ignore.
  }

  // Seed default categories
  const categoriesCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM categories');
  if (categoriesCount && categoriesCount.count === 0) {
    await db.execAsync(`
      INSERT INTO categories (name, icon, color) VALUES 
      ('Food & Dining', 'restaurant', '#f43f5e'),
      ('Shopping', 'cart', '#3b82f6'),
      ('Transportation', 'car', '#eab308'),
      ('Entertainment', 'film', '#a855f7'),
      ('Bills & Utilities', 'flash', '#10b981');
    `);
  }
}