import { Account } from "./account";
import { Category } from "./category";

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
}

export interface AccountBreakdown {
  account: Account;
  balance: number;
  transactions: number;
}

export interface Report {
  _id: string;
  user: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categoryBreakdown: CategoryBreakdown[];
  accountBreakdown: AccountBreakdown[];
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportResponse {
  status: string;
  data: Report;
}

export interface DateRange {
  from: Date;
  to: Date;
}
