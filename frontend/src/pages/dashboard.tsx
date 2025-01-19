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
  TriangleDashed,
  BoxIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RecentTransactions } from "@/components/recent-transactions";
import { AccountsOverview } from "@/components/accounts-overview";
import { BudgetOverview } from "@/components/budget-overview";
import { SpendingByCategory } from "@/components/spending-by-category";
import { useEffect, useMemo, useState } from "react";
import { Budget, Report, Transaction } from "@/types";
import { Account } from "@/types/account";
import useFetch from "@/hooks/use-fetch";
import usePost from "@/hooks/use-post";

const Dashboard = () => {
  const [report, setReport] = useState<Report | null>(null);

  // Memoize date calculations
  const dates = useMemo(() => {
    const end = new Date().toISOString();
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    return { startDate: start, endDate: end };
  }, []);

  const {
    data: accountsData,
    error: accountsError,
    isLoading: accountsLoading,
  } = useFetch("/accounts");

  const {
    data: transactionsData,
    error: transactionsError,
    isLoading: transactionsLoading,
  } = useFetch(`/transactions`);

  const {
    data: budgetsData,
    error: budgetsError,
    isLoading: budgetsLoading,
  } = useFetch("/budgets");

  const {
    add: fetchReport,
    isAdding: reportLoading,
    error: reportError,
    // data: reportData,
  } = usePost("/reports");

  const accounts: Account[] = Array.isArray(accountsData) ? accountsData : [];
  const transactions: Transaction[] = Array.isArray(transactionsData)
    ? transactionsData
    : [];
  const budgets: Budget[] = Array.isArray(budgetsData) ? budgetsData : [];

  useEffect(() => {
    const getReport = async () => {
      try {
        const response = await fetchReport({
          startDate: dates.startDate,
          endDate: dates.endDate,
        });
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    getReport();
  }, [fetchReport]);

  const isLoading =
    accountsLoading || transactionsLoading || budgetsLoading || reportLoading;
  const error =
    accountsError || transactionsError || budgetsError || reportError;

  // Calculate summary statistics
  const summaryStats = {
    totalBalance: accounts.reduce(
      (sum: number, account: Account) => sum + account.balance,
      0
    ),
    monthlyIncome: transactions
      .filter((t: Transaction) => t.type === "INCOME")
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
    monthlyExpenses: transactions
      .filter((t: Transaction) => t.type === "EXPENSE")
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
    savingsRate:
      report && report?.netBalance > 0
        ? ((report.netBalance / report.totalIncome) * 100).toFixed(1)
        : 0,
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-96">Loading...</div>
    );
  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summaryStats.totalBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
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
            <div className="text-2xl font-bold">
              ${summaryStats.monthlyIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
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
            <div className="text-2xl font-bold">
              ${summaryStats.monthlyExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryStats.savingsRate}%
            </div>
            <p className="text-xs text-muted-foreground">Of monthly income</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total transactions
            </CardTitle>
            <TriangleDashed className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts</CardTitle>
            <BoxIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      {budgets.some((b: Budget) => b.spent > b.amount) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have exceeded your budget in some categories. Please review your
            spending.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Transactions Chart */}
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
                  data={report?.categoryBreakdown || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category.name" />
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

        {/* Account Overview */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountsOverview accounts={accounts} />
          </CardContent>
        </Card>

        {/* Category Spending */}
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
