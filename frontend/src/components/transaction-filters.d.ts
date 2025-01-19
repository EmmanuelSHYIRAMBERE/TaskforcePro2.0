import { TransactionFilters } from "@/types/transaction";
interface TransactionFiltersComponentProps {
    filters: TransactionFilters;
    onFilterChange: (filters: TransactionFilters) => void;
}
export declare const TransactionFiltersComponent: React.FC<TransactionFiltersComponentProps>;
export {};
