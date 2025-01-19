import * as z from "zod";
import { Account } from "@/types/account";
declare const accountSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["BANK", "MOBILE_MONEY", "CASH", "OTHER"]>;
    currency: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "BANK" | "MOBILE_MONEY" | "CASH" | "OTHER";
    name: string;
    currency: string;
    description?: string | undefined;
    isActive?: boolean | undefined;
}, {
    type: "BANK" | "MOBILE_MONEY" | "CASH" | "OTHER";
    name: string;
    currency: string;
    description?: string | undefined;
    isActive?: boolean | undefined;
}>;
interface AccountFormProps {
    open: boolean;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (data: z.infer<typeof accountSchema>) => void;
    account?: Account | null;
}
export declare const AccountForm: ({ open, isLoading, onClose, onSubmit, account, }: AccountFormProps) => import("react/jsx-runtime").JSX.Element;
export {};
