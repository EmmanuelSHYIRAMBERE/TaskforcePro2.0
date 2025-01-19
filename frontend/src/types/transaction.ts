import { Account, Category } from "@/lib/types";

export type TransactionType = "EXPENSE" | "INCOME";

export interface Transaction {
  _id: string;
  user: string;
  account: Account;
  category: Category;
  subcategory?: Category;
  type: TransactionType;
  amount: number;
  description?: string;
  date: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  account?: string;
  type?: TransactionType;
}

export interface TransactionReport {
  id: {
    type: string;
    category: string;
    year: number;
    month: number;
  };
  total: number;
  count: number;
  categoryInfo: Category[];
}
