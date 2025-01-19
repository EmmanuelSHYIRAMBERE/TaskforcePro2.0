import { z } from "zod";
export declare const AccountSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["bank", "cash", "mobile_money"]>;
    balance: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    accountNumber: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "bank" | "mobile_money" | "cash";
    name: string;
    currency: string;
    balance: number;
    accountNumber?: string | undefined;
}, {
    type: "bank" | "mobile_money" | "cash";
    name: string;
    balance: number;
    currency?: string | undefined;
    accountNumber?: string | undefined;
}>;
export declare const transferSchema: z.ZodObject<{
    fromAccount: z.ZodString;
    toAccount: z.ZodString;
    amount: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    fromAccount: string;
    toAccount: string;
    description?: string | undefined;
}, {
    amount: number;
    fromAccount: string;
    toAccount: string;
    description?: string | undefined;
}>;
export type TransferData = z.infer<typeof transferSchema>;
