import { Transaction } from "@/types/transaction";
interface TransactionTableProps {
    transactions: Transaction[];
    isLoading: boolean;
    onRefresh: () => void;
}
export declare const TransactionTable: React.FC<TransactionTableProps>;
export {};
