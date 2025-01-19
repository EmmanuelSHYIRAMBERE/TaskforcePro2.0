import { Budget } from "@/types";
import { Progress } from "./ui/progress";

export const BudgetOverview = ({ budgets }: { budgets: Budget[] }) => {
  return (
    <div className="space-y-4">
      {budgets.map((budget) => (
        <div key={budget.id} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{budget.category}</span>
            <span className="text-sm text-muted-foreground">
              ${budget.spent} / ${budget.amount}
            </span>
          </div>
          <Progress
            value={(budget.spent / budget.amount) * 100}
            className={budget.spent > budget.amount ? "text-red-500" : ""}
          />
        </div>
      ))}
    </div>
  );
};
