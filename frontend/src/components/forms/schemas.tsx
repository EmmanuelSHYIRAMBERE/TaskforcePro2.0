import { z } from "zod";

// Define the Account schema
export const AccountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["bank", "cash", "mobile_money"]),
  balance: z.number().min(0, "Balance must be non-negative"),
  currency: z.string().default("USD"),
  accountNumber: z.string().optional(),
});

// Define the Transfer Schema
export const transferSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  toAccount: z.string().min(1, "Destination account is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  description: z.string().optional(),
});

export type TransferData = z.infer<typeof transferSchema>;
