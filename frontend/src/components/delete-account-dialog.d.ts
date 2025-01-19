import { Account } from "@/types/account";
interface DeleteAccountDialogProps {
    account: Account | null;
    onClose: () => void;
    onConfirm: (accountId: string) => void;
}
export declare const DeleteAccountDialog: ({ account, onClose, onConfirm, }: DeleteAccountDialogProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
