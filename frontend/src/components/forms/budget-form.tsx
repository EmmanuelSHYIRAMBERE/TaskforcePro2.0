import React, { useState } from "react";
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
import useFetch from "@/hooks/use-fetch";

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => Promise<void>;
  initialData?: Partial<BudgetFormData>;
  isLoading?: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  onSubmit,
  initialData = {},
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    category: initialData.category || "",
    amount: initialData.amount || "",
    period: initialData.period || "MONTHLY",
    startDate: initialData.startDate || "",
    endDate: initialData.endDate || "",
    notifications: initialData.notifications ?? true,
  });

  // Fetch categories
  const { data: categories, isLoading: isFetching } = useFetch("/categories");
  const categoryList = categories?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select a category.");
      return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
          disabled={isFetching}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categoryList.map((cat: { _id: string; name: string }) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount Input */}
      <Input
        type="number"
        placeholder="Enter amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full"
      />

      {/* Period Selection */}
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
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="MONTHLY">Monthly</SelectItem>
          <SelectItem value="WEEKLY">Weekly</SelectItem>
          <SelectItem value="YEARLY">Yearly</SelectItem>
        </SelectContent>
      </Select>

      {/* Start Date */}
      <Input
        type="date"
        value={formData.startDate}
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
        className="w-full"
      />

      {/* End Date */}
      <Input
        type="date"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        className="w-full"
      />

      {/* Notifications Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.notifications}
          onChange={(e) =>
            setFormData({ ...formData, notifications: e.target.checked })
          }
        />
        <label>Enable Notifications</label>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Budget"}
      </Button>
    </form>
  );
};
