import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  AlertCircle,
  PiggyBank,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Account, Budget, Transaction } from "@/types";
import { RecentTransactions } from "@/components/recent-transactions";
import { AccountsOverview } from "@/components/accounts-overview";
import { BudgetOverview } from "@/components/budget-overview";
import { SpendingByCategory } from "@/components/spending-by-category";

const Dashboard = () => {
  // Sample data - would come from your API/state management
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2024-01-19",
      description: "Salary",
      amount: 5000,
      type: "income",
      category: "Salary",
      account: "Bank Account",
    },
  ];

  const accounts: Account[] = [
    {
      id: "1",
      name: "Main Bank Account",
      type: "bank",
      balance: 15000,
      currency: "USD",
      lastUpdated: "2024-01-19",
    },
  ];

  const budgets: Budget[] = [
    {
      id: "1",
      category: "Food",
      amount: 500,
      spent: 450,
      period: "monthly",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Income
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,231.89</div>
            <p className="text-xs text-muted-foreground">
              +4.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Expenses
            </CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,542.67</div>
            <p className="text-xs text-muted-foreground">
              -2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.4%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      {budgets.some((b) => b.spent > b.amount) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have exceeded your budget in some categories. Please check your
            spending.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Section */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="expenses">
              <TabsList>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="balance">Balance</TabsTrigger>
              </TabsList>
              <TabsContent value="expenses" className="h-[300px]">
                <LineChart
                  data={transactions}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#ef4444"
                    name="Expenses"
                  />
                </LineChart>
              </TabsContent>
              {/* Add other tabs content */}
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions.slice(0, 5)} />
          </CardContent>
        </Card>

        {/* Accounts Overview */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountsOverview accounts={accounts} />
          </CardContent>
        </Card>

        {/* Spending by Category */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingByCategory transactions={transactions} />
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetOverview budgets={budgets} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
