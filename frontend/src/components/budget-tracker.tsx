import React from "react";
import { Budget } from "@/types/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BudgetOverviewProps {
  budgets: Budget[];
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgets }) => {
  const chartData = budgets.map((budget) => ({
    name: budget.category.name,
    limit: budget.amount,
    spent: budget.spent,
  }));

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="limit" fill="#8884d8" name="Budget Limit" />
              <Bar dataKey="spent" fill="#82ca9d" name="Spent Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
