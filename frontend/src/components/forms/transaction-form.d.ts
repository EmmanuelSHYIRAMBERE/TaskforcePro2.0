import { Transaction } from "@/types/transaction";
import { Account } from "@/types";
import { Category } from "@/lib/types";
interface TransactionFormProps {
    onSubmit: (data: Partial<Transaction>) => void;
    initialData?: Partial<Transaction>;
    accounts: Account[];
    categories: Category[];
}
export declare const TransactionForm: React.FC<TransactionFormProps>;
export {};
