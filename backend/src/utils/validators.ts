import { z } from "zod";
import { constants } from "../config/constants";

export const createTransactionSchema = z.object({
  accountId: z.string(),
  categoryId: z.string(),
  amount: z.number().positive(),
  type: z.enum(constants.TRANSACTION_TYPES),
  description: z.string().min(3).max(200),
  date: z.string().optional(),
});

export const createBudgetSchema = z.object({
  categoryId: z.string(),
  amount: z.number().positive(),
  period: z.enum(constants.BUDGET_PERIODS),
  startDate: z.string(),
  endDate: z.string(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  type: z.enum(constants.TRANSACTION_TYPES),
  parentId: z.string().optional(),
});

export const createAccountSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.enum(constants.ACCOUNT_TYPES),
  currency: z.enum(constants.SUPPORTED_CURRENCIES),
  initialBalance: z.number().default(0),
});
