import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowUpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BudgetFormData } from "@/types/budget";
import { BudgetOverview } from "@/components/budget-overview";
import { BudgetList } from "@/components/budget-list";
import useFetch from "@/hooks/use-fetch";
import usePost from "@/hooks/use-post";

const Budget: React.FC = () => {
  const { toast } = useToast();

  // Fetch budgets
  const {
    data: budgets,
    error: fetchError,
    isLoading: isFetching,
  } = useFetch("/budgets");

  // Create budget
  const {
    add: createBudget,
    isAdding: isCreating,
    error: createError,
  } = usePost("/budgets");

  // Update budget
  const {
    add: updateBudget,
    isAdding: isUpdating,
    error: updateError,
  } = usePost("/budgets");

  // Delete budget
  const {
    add: deleteBudget,
    isAdding: isDeleting,
    error: deleteError,
  } = usePost("/budgets");

  const handleCreateBudget = async (data: BudgetFormData) => {
    try {
      await createBudget(data);
      await refetchBudgets();
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: createError?.message || "Failed to create budget",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBudget = async (id: string, data: Partial<Budget>) => {
    try {
      await updateBudget({ ...data, id }, `/budgets/${id}`);
      await refetchBudgets();
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: updateError?.message || "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteBudget({ id }, `/budgets/${id}`);
      await refetchBudgets();
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: deleteError?.message || "Failed to delete budget",
        variant: "destructive",
      });
    }
  };

  if (fetchError) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Error loading budgets: {fetchError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {budgets
                ?.reduce((sum, budget) => sum + budget.amount, 0)
                .toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {budgets
                ?.reduce((sum, budget) => sum + budget.spent, 0)
                .toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Budgets
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgets?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <BudgetList
        budgets={budgets || []}
        isLoading={isFetching}
        onCreateBudget={handleCreateBudget}
        onUpdateBudget={handleUpdateBudget}
        onDeleteBudget={handleDeleteBudget}
        isCreating={isCreating}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />

      {budgets && <BudgetOverview budgets={budgets} />}
    </div>
  );
};

export default Budget;
