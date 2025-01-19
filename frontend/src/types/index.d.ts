export type Transaction = {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    subcategory?: string;
    account: string;
};
export type Category = {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
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
export type Report = {
    id: string;
    startDate: string;
    endDate: string;
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    categoryBreakdown: Category[];
    accountBreakdown: Account[];
    transactions: Transaction[];
    generatedAt: string;
};
