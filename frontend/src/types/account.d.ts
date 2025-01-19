export interface Account {
    _id: string;
    name: string;
    type: "BANK" | "MOBILE_MONEY" | "CASH" | "OTHER";
    balance: number;
    currency: string;
    description?: string;
    isActive: boolean;
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
}
export interface AccountFormData {
    name: string;
    type: Account["type"];
    currency: string;
    description?: string;
}
export interface TransferData {
    fromAccount: string;
    toAccount: string;
    amount: number;
    description?: string;
}
