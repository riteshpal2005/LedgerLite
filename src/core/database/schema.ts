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
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export const CREATE_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT
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

export async function initializeDatabase(db: SQLiteDatabase) {
  // Ref: schema-1
  await db.execAsync(CREATE_CATEGORIES_TABLE);
  await db.execAsync(CREATE_EXPENSES_TABLE);
}