import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const BudgetTracker = () => {
  const [budgets, setBudgets] = useState([
    { id: 1, category: "Food", limit: 500, spent: 450 },
    { id: 2, category: "Transportation", limit: 300, spent: 200 },
    { id: 3, category: "Entertainment", limit: 200, spent: 180 },
  ]);

  const [newBudget, setNewBudget] = useState({
    category: "",
    limit: "",
  });

  const handleAddBudget = () => {
    const budget = {
      id: budgets.length + 1,
      category: newBudget.category,
      limit: Number(newBudget.limit),
      spent: 0,
    };
    setBudgets([...budgets, budget]);
    setNewBudget({ category: "", limit: "" });
    toast.success("Budget added successfully");
  };

  const checkBudgetStatus = (
    category: string,
    spent: number,
    limit: number
  ) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) {
      toast.error(`Budget alert: ${category} budget is almost exceeded!`);
      return "bg-red-500";
    }
    if (percentage >= 75) {
      return "bg-yellow-500";
    }
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budget Tracking</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, category: e.target.value })
                  }
                  placeholder="Enter category"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Budget Limit</label>
                <Input
                  type="number"
                  value={newBudget.limit}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, limit: e.target.value })
                  }
                  placeholder="Enter amount"
                />
              </div>
              <Button onClick={handleAddBudget} className="w-full">
                Add Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <Card key={budget.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {budget.category}
              </CardTitle>
              {budget.spent >= budget.limit * 0.9 && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress
                  value={(budget.spent / budget.limit) * 100}
                  className={checkBudgetStatus(
                    budget.category,
                    budget.spent,
                    budget.limit
                  )}
                />
                <div className="flex justify-between text-sm">
                  <span>Spent: ${budget.spent}</span>
                  <span>Limit: ${budget.limit}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BudgetTracker;
