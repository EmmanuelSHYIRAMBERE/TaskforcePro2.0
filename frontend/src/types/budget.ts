export interface Category {
  _id: string;
  name: string;
}

export interface Budget {
  _id: string;
  category: Category;
  amount: number;
  spent: number;
  period: "MONTHLY" | "WEEKLY" | "YEARLY";
  startDate: string;
  endDate: string;
  notifications: boolean;
}

export interface BudgetFormData {
  category: string;
  amount: string;
  period: "MONTHLY" | "WEEKLY" | "YEARLY";
  startDate: string;
  endDate: string;
  notifications: boolean;
}
