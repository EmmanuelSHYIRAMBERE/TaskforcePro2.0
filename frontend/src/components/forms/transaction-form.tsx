import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Transaction, TransactionType } from "@/types/transaction";
import { Account } from "@/types";
import { Category } from "@/lib/types";

interface TransactionFormProps {
  onSubmit: (data: Partial<Transaction>) => void;
  initialData?: Partial<Transaction>;
  accounts: Account[];
  categories: Category[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialData,
  accounts,
  categories,
}) => {
  const [formData, setFormData] = useState<Partial<Transaction>>(
    initialData || {
      type: "EXPENSE",
      amount: 0,
      date: new Date().toISOString(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Transaction Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: TransactionType) =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
          }
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select
            value={formData.account?.id}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                account: accounts.find((a) => a.id === value),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category?.id}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                category: categories.find((c) => c.id === value),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter(
                  (cat) => !cat.type || cat.type?.toString() === formData.type
                )
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date
                ? format(new Date(formData.date), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date ? new Date(formData.date) : undefined}
              onSelect={(date) =>
                setFormData({ ...formData, date: date?.toISOString() })
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update" : "Add"} Transaction
      </Button>
    </form>
  );
};
