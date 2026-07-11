import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number().nonnegative(),
  date: z.number().positive(),
  description: z.string(),
  type: z.enum(["income", "expense", "transfer"]),
  categoryId: z.string(),
  accountId: z.string(),
  merchant: z.string().optional().nullable(),
  sync_status: z.enum(["synced", "pending", "deleted", "unmapped"]).optional(),
  balance_after: z.number().optional().nullable(),
  created_at: z.number().optional(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  type: z.enum(["income", "expense", "transfer", "system"]),
  is_default: z.boolean().or(z.number()),
  sync_status: z.enum(["synced", "pending", "deleted"]).optional(),
  created_at: z.number().optional(),
});

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["Cash", "Bank", "Credit Card", "Wallet"]),
  balance: z.number(),
  sync_status: z.enum(["synced", "pending", "deleted"]).optional(),
  created_at: z.number().optional(),
});
