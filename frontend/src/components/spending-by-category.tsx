import { Transaction } from "@/types/transaction";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface SpendingByCategoryProps {
  transactions: Transaction[];
}

export const SpendingByCategory = ({
  transactions,
}: SpendingByCategoryProps) => {
  // Process transactions to get category totals
  const categoryTotals = transactions
    .filter((t: Transaction) => t.type === "EXPENSE")
    .reduce((acc, curr) => {
      acc[curr._id] = (acc[curr._id] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  // Convert to format needed for pie chart
  const chartData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  // Colors for different categories
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            name,
          }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

            return percent > 0.05 ? (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-xs"
              >
                {`${name} ${(percent * 100).toFixed(0)}%`}
              </text>
            ) : null;
          }}
          outerRadius={100}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>

      {/* Category List */}
      <div className="ml-4 space-y-2">
        {chartData.map((category, index) => (
          <div key={category.name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm">
              {category.name}: ${category.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
