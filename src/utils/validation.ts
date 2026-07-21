import { z } from "zod";


export const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number().nonnegative(),
  date: z.number().positive(),
  description: z.string(),
  type: z.enum(["credit", "debit"]),
  categoryId: z.string(),
  accountId: z.string().optional().nullable(),
  merchant: z.string().optional().nullable(),
  sync_status: z.enum(["synced", "pending", "deleted"]).optional(),
  balance_after: z.number().optional().nullable(),
  linkedTransactionId: z.string().optional().nullable(),
  updated_at: z.number().optional()
});


export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  sync_status: z.enum(["synced", "pending", "deleted"]).optional(),
  updated_at: z.number().optional()
});


export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["Cash", "Bank", "Credit Card"]),
  balance: z.number(),
  sync_status: z.enum(["synced", "pending", "deleted"]).optional(),
  updated_at: z.number().optional()
});