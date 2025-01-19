import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { TransactionFilters, TransactionType } from "@/types/transaction";

interface TransactionFiltersComponentProps {
  filters: TransactionFilters;
  onFilterChange: (filters: TransactionFilters) => void;
}

export const TransactionFiltersComponent: React.FC<
  TransactionFiltersComponentProps
> = ({ filters, onFilterChange }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );

  const handleDateSelect =
    (field: "startDate" | "endDate") => (date: Date | undefined) => {
      if (field === "startDate") {
        setStartDate(date);
      } else {
        setEndDate(date);
      }

      onFilterChange({
        ...filters,
        [field]: date?.toISOString(),
      });
    };

  const handleTypeChange = (type: TransactionType | "") => {
    if (type === "") {
      const { ...restFilters } = filters;
      onFilterChange(restFilters);
    } else {
      onFilterChange({ ...filters, type });
    }
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleDateSelect("startDate")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleDateSelect("endDate")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Select value={filters.type || ""} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="flex items-center"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
