import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { RecentTransactions } from "@/components/recent-transactions";
import { AccountsOverview } from "@/components/accounts-overview";
import { BudgetOverview } from "@/components/budget-overview";
import { SpendingByCategory } from "@/components/spending-by-category";
import { Account } from "@/types/account";
import useFetch from "@/hooks/use-fetch";
import usePost from "@/hooks/use-post";
import { Report, CategoryBreakdown } from "@/types/reports";
import { Transaction } from "@/types/transaction";
import { Budget } from "@/types/budget";

// Define interfaces for chart data
interface ChartDataPoint {
  date: string;
  amount: number;
}

interface TransformedData {
  expenses: CategoryBreakdown[];
  income: ChartDataPoint[];
  balance: ChartDataPoint[];
}

const Dashboard = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState("expenses");
  const [chartData, setChartData] = useState<TransformedData>({
    expenses: [],
    income: [],
    balance: [],
  });

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
  } = usePost("/reports");

  // Memoize processed data
  const accounts = useMemo(
    () => (accountsData?.data || []) as Account[],
    [accountsData]
  );

  const transactions = useMemo(
    () => (transactionsData?.data || []) as Transaction[],
    [transactionsData]
  );

  const budgets = useMemo(
    () => (budgetsData?.data || []) as Budget[],
    [budgetsData]
  );

  // Transform report data for different views
  useEffect(() => {
    if (report) {
      // Group transactions by date for income and balance charts
      const dailyData = transactions.reduce(
        (
          acc: {
            [key: string]: {
              income: number;
              expenses: number;
              balance: number;
            };
          },
          transaction: Transaction
        ) => {
          const date = new Date(transaction.date).toISOString().split("T")[0];
          if (!acc[date]) {
            acc[date] = {
              income: 0,
              expenses: 0,
              balance: 0,
            };
          }

          if (transaction.type === "INCOME") {
            acc[date].income += transaction.amount;
          } else {
            acc[date].expenses += transaction.amount;
          }
          acc[date].balance = acc[date].income - acc[date].expenses;

          return acc;
        },
        {}
      );

      const transformedData: TransformedData = {
        expenses: report.categoryBreakdown,
        income: Object.entries(dailyData).map(([date, data]) => ({
          date,
          amount: (data as { income: number }).income,
        })),
        balance: Object.entries(dailyData).map(([date, data]) => ({
          date,
          amount: (data as { balance: number }).balance,
        })),
      };

      setChartData(transformedData);
    }
  }, [report, transactions]);

  useEffect(() => {
    const getReport = async () => {
      try {
        const response = await fetchReport({
          startDate: dates.startDate,
          endDate: dates.endDate,
          type: activeTab.toUpperCase(),
        });
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    getReport();
  }, [fetchReport, activeTab, dates]);

  const summaryStats = useMemo(
    () => ({
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
    }),
    [accounts, transactions, report]
  );

  const getChartData = () => {
    switch (activeTab) {
      case "income":
        return chartData.income;
      case "balance":
        return chartData.balance;
      default:
        return chartData.expenses;
    }
  };

  const getChartConfig = () => {
    const baseConfig = {
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
      xAxisKey: activeTab === "expenses" ? "category.name" : "date",
    };

    switch (activeTab) {
      case "income":
        return {
          ...baseConfig,
          lines: [
            {
              key: "amount",
              name: "Income",
              stroke: "#22c55e",
            },
          ],
        };
      case "balance":
        return {
          ...baseConfig,
          lines: [
            {
              key: "amount",
              name: "Net Balance",
              stroke: "#3b82f6",
            },
          ],
        };
      default:
        return {
          ...baseConfig,
          lines: [
            {
              key: "amount",
              name: "Expenses",
              stroke: "#ef4444",
            },
          ],
        };
    }
  };

  if (
    accountsLoading ||
    transactionsLoading ||
    budgetsLoading ||
    reportLoading
  ) {
    return (
      <div className="flex items-center justify-center h-96">Loading...</div>
    );
  }

  const error =
    accountsError || transactionsError || budgetsError || reportError;
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const chartConfig = getChartConfig();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
        {/* Financial Overview Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="expenses" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="balance">Balance</TabsTrigger>
              </TabsList>
              <div className="h-[300px] mt-4">
                <LineChart
                  data={getChartData()}
                  margin={chartConfig.margin}
                  width={600}
                  height={300}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={chartConfig.xAxisKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chartConfig.lines.map((line) => (
                    <Line
                      key={line.key}
                      type="monotone"
                      dataKey={line.key}
                      stroke={line.stroke}
                      name={line.name}
                    />
                  ))}
                </LineChart>
              </div>
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
