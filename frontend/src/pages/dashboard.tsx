import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account, Transaction } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AccountCard } from "@/components/dashboard/account-card";
import { DataTable } from "@/components/ui/data-table";

export function Dashboard() {
  const [accounts] = useState<Account[]>([]);
  const [recentTransactions] = useState<Transaction[]>([]);
  const [spendingData] = useState<{ date: string; amount: number }[]>([]);

  // Fetch data effects would go here

  const transactionColumns = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({
        row,
      }: {
        row: { getValue: (key: string) => string | number };
      }) => {
        return new Date(row.getValue("date")).toLocaleDateString();
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return (
          <div className={amount < 0 ? "text-red-500" : "text-green-500"}>
            {formatted}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={transactionColumns} data={recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
