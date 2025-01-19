import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/types/transaction";

interface TransactionChartProps {
  transactions: Transaction[];
}

export const TransactionChart: React.FC<TransactionChartProps> = ({
  transactions,
}) => {
  const chartData = useMemo(() => {
    const groupedByMonth = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          expenses: 0,
          income: 0,
        };
      }

      if (transaction.type === "EXPENSE") {
        acc[monthYear].expenses += transaction.amount;
      } else {
        acc[monthYear].income += transaction.amount;
      }

      return acc;
    }, {} as Record<string, { month: string; expenses: number; income: number }>);

    return Object.values(groupedByMonth).sort((a, b) => {
      return new Date(a.month).getTime() - new Date(b.month).getTime();
    });
  }, [transactions]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
          />
          <Legend />
          <Bar
            dataKey="income"
            name="Income"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
