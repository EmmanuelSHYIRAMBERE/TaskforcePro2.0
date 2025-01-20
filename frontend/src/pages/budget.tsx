import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowUpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Budget as BudgetType } from "@/types/budget";
import type { BudgetFormData } from "@/types/budget";
import { BudgetOverview } from "@/components/budget-overview";
import { BudgetList } from "@/components/budget-list";
import useFetch from "@/hooks/use-fetch";
import usePost from "@/hooks/use-post";
import axios from "axios";
import { useState } from "react";

const Budget: React.FC = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch budgets
  const {
    data: budgets,
    error: fetchError,
    isLoading: isFetching,
  } = useFetch("/budgets");

  const budgetsData = budgets?.data || [];

  // Create budget
  const {
    add: createBudget,
    isAdding: isCreating,
    error: createError,
  } = usePost("/budgets");

  useEffect(() => {
    if (createError) {
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      });
    }
  }, [createError, toast]);

  const handleCreateBudget = async (formData: BudgetFormData) => {
    try {
      // Ensure all required fields are present
      const budgetData = {
        category: formData.category,
        amount: Number(formData.amount),
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notifications: formData.notifications ?? false,
      };

      // Validate required fields
      const requiredFields = [
        "category",
        "amount",
        "period",
        "startDate",
        "endDate",
      ];
      const missingFields = requiredFields.filter(
        (field) => !budgetData[field as keyof typeof budgetData]
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      await createBudget({
        extraArgument: budgetData as Record<string, unknown>,
      });

      toast({
        title: "Success",
        description: "Budget created successfully",
      });
    } catch (err) {
      console.log("Error creating budget", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to create budget",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBudget = async (id: string, data: Partial<BudgetType>) => {
    setIsUpdating(true);
    try {
      await axios.patch(`/api/v1/budgets/${id}`, data);

      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (err) {
      console.log("Error updating budget", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update budget",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/v1/budgets/${id}`);

      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    } catch (err) {
      console.log("Error deleting budget", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete budget",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
              {budgetsData
                ?.reduce(
                  (sum: number, budget: BudgetType) => sum + budget.amount,
                  0
                )
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
              {budgetsData
                ?.reduce(
                  (sum: number, budget: BudgetType) => sum + budget.spent,
                  0
                )
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
            <div className="text-2xl font-bold">{budgetsData?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <BudgetList
        budgets={budgetsData || []}
        isLoading={isFetching}
        onCreateBudget={handleCreateBudget}
        onUpdateBudget={handleUpdateBudget}
        onDeleteBudget={handleDeleteBudget}
        isCreating={isCreating}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />

      {budgetsData && <BudgetOverview budgets={budgetsData} />}
    </div>
  );
};

export default Budget;
