export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  subcategory?: string;
  account: string;
};

export type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  subcategories: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Account = {
  id: string;
  name: string;
  type: "bank" | "cash" | "mobile_money";
  balance: number;
  currency: string;
  lastUpdated: string;
  accountNumber?: string;
};

export type Transfer = {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: string;
  description: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: "monthly" | "yearly";
};
