import * as z from "zod";
import { Account } from "@/types/account";
declare const transferSchema: z.ZodEffects<z.ZodObject<{
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
}>, {
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
interface TransferFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: z.infer<typeof transferSchema>) => void;
    accounts: Account[];
}
declare const TransferForm: ({ open, onClose, onSubmit, accounts, }: TransferFormProps) => import("react/jsx-runtime").JSX.Element;
export default TransferForm;
