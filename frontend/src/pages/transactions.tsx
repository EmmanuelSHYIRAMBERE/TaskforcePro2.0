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
import { Alert, AlertDescription } from "@/components/ui/alert";

import useFetch from "@/hooks/use-fetch";
import usePost from "@/hooks/use-post";
import { Account } from "@/types";

const Transactions: React.FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { toast } = useToast();

  const {
    data: accountsData,
    error: accountsError,
    isLoading: accountsLoading,
  } = useFetch("/accounts");

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useFetch(`/categories`);

  const {
    data: transactionsData,
    error: transactionsError,
    isLoading: transactionsLoading,
  } = useFetch(`/transactions`);

  useEffect(() => {
    if (transactionsError) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  }, [transactionsError, toast]);

  const accounts = accountsData?.data || [];
  const categories = categoriesData?.data || [];
  const transactions = transactionsData?.data || [];

  const {
    add,
    isAdding: transactionsAdding,
    error: transactionsAddError,
  } = usePost("/transactions");

  const handleAddTransaction = async (data: Partial<Transaction>) => {
    if (data.type === "EXPENSE" && data.amount && data.account) {
      const selectedAccount = accounts.find(
        (a: Account) => a.id === data.account?.id
      );
      if (selectedAccount && data.amount > selectedAccount.balance) {
        toast({
          title: "Insufficient Funds",
          description: `The entered amount exceeds the available balance in the selected account (${selectedAccount.balance} ${selectedAccount.currency}).`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      await add(data);
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const isLoading =
    accountsLoading ||
    transactionsLoading ||
    categoriesLoading ||
    transactionsAdding;
  const error =
    accountsError ||
    transactionsError ||
    categoriesError ||
    transactionsAddError;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-96">Loading...</div>
    );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
          <TransactionTable transactions={transactions} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
