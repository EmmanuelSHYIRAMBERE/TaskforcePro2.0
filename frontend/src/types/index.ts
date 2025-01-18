export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    currency: string;
    timezone: string;
    notifications: NotificationPreferences;
  };
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: "bank" | "mobile_money" | "cash";
  balance: number;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  budget?: number;
  color?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  date: Date;
  tags?: string[];
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: Date;
  endDate?: Date;
}

export interface NotificationPreferences {
  budgetAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}
