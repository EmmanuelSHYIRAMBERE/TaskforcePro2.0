export type TransactionType = "income" | "expense";
export type AccountType = "bank" | "mobile_money" | "cash";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  subCategoryId?: string;
  accountId: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: "monthly" | "yearly";
  startDate: string;
  endDate: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}

export interface Report {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  balanceChange: number;
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}
