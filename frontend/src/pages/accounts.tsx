import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Account } from "@/types";

export const Accounts = () => {
  // Replace with actual data fetching
  const accounts: Account[] = [];

  const columns = [
    {
      accessorKey: "name",
      header: "Account Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
        const balance = parseFloat(row.getValue("balance"));
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(balance);
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
        <Button>Add Account</Button>
      </div>
      <DataTable columns={columns} data={accounts} />
    </div>
  );
};
