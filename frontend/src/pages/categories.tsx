import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Category } from "@/types";

export const Categories = () => {
  // Replace with actual data fetching
  const categories: Category[] = [];

  const columns = [
    {
      accessorKey: "name",
      header: "Category Name",
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }: { row: any }) => {
        const budget = parseFloat(row.getValue("budget"));
        return budget
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(budget)
          : "-";
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Button>Add Category</Button>
      </div>
      <DataTable columns={columns} data={categories} />
    </div>
  );
};
