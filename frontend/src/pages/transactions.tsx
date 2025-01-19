import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Transaction, TransactionFilters } from "@/types/transaction";
import { useToast } from "@/hooks/use-toast";
import { TransactionForm } from "@/components/forms/transaction-form";
import { TransactionTable } from "@/components/transaction-table";
import { TransactionChart } from "@/components/transaction-chart";
import { TransactionFiltersComponent } from "@/components/transaction-filters";
import { Account } from "@/types";
import { Category } from "@/lib/types";

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/v1/accounts");

      const data = await response.json();
      setAccounts(data.data);
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Error",
        description: "Failed to fetch accounts",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/v1/categories");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/v1/transactions?${queryParams}`);
      const data = await response.json();
      setTransactions(data.data);
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (data: Partial<Transaction>) => {
    try {
      const response = await fetch("/api/v1/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Transaction added successfully",
        });
        fetchTransactions();
      }
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchAccounts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              onSubmit={handleAddTransaction}
              accounts={accounts}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionChart transactions={transactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionFiltersComponent
              filters={filters}
              onFilterChange={setFilters}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={transactions}
            isLoading={isLoading}
            onRefresh={fetchTransactions}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
