import React from "react";
import { Budget, BudgetFormData } from "@/types/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BudgetForm } from "./forms/budget-form";
import Loader from "./loader";

interface BudgetListProps {
  budgets: Budget[];
  isLoading: boolean;
  onCreateBudget: (data: BudgetFormData) => Promise<void>;
  onUpdateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  onDeleteBudget: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const BudgetList: React.FC<BudgetListProps> = ({
  budgets,
  isLoading,
  onCreateBudget,
  //   onUpdateBudget,
  onDeleteBudget,
  isCreating,
  isUpdating,
  isDeleting,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedBudget, setSelectedBudget] = React.useState<Budget | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Budgets</CardTitle>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" disabled={isCreating}>
              {isCreating ? <Loader /> : <Plus size={16} />}
              {isCreating ? "Creating..." : "New Budget"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm
              onSubmit={async (data) => {
                await onCreateBudget(data);
                setIsCreateModalOpen(false);
              }}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget._id}>
                <TableCell>{budget.category.name}</TableCell>
                <TableCell>{budget.period}</TableCell>
                <TableCell>${budget.amount}</TableCell>
                <TableCell>${budget.spent}</TableCell>
                <TableCell className="w-64">
                  <div className="space-y-1">
                    <Progress value={(budget.spent / budget.amount) * 100} />
                    <p className="text-xs text-gray-500">
                      {((budget.spent / budget.amount) * 100).toFixed(1)}%
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedBudget(budget)}
                      disabled={isUpdating}
                    >
                      {isUpdating && selectedBudget?._id === budget._id ? (
                        <Loader />
                      ) : (
                        <Edit size={16} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteBudget(budget._id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? <Loader /> : <Trash2 size={16} />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
