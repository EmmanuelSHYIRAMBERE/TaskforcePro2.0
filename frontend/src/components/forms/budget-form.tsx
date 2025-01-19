import React from "react";
import { BudgetFormData } from "@/types/budget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => Promise<void>;
  initialData?: Partial<BudgetFormData>;
  isLoading?: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [formData, setFormData] = React.useState<BudgetFormData>({
    category: initialData?.category || "",
    amount: initialData?.amount || "",
    period: initialData?.period || "MONTHLY",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    notifications: initialData?.notifications || true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Select
          value={formData.period}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              period: value as "MONTHLY" | "WEEKLY" | "YEARLY",
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="YEARLY">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full"
      />

      <Input
        type="datetime-local"
        placeholder="Start Date"
        value={formData.startDate}
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
        className="w-full"
      />

      <Input
        type="datetime-local"
        placeholder="End Date"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        className="w-full"
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.notifications}
          onChange={(e) =>
            setFormData({ ...formData, notifications: e.target.checked })
          }
        />
        <span>Enable Notifications</span>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Budget"}
      </Button>
    </form>
  );
};
