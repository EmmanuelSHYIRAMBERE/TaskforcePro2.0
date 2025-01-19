import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

import { Transaction } from "@/types";

export const RecentTransactions = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <div
              className={`p-2 rounded-full ${
                transaction.type === "INCOME"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {transaction.type === "INCOME" ? (
                <ArrowUpCircle />
              ) : (
                <ArrowDownCircle />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">
                {transaction.date}
              </p>
            </div>
          </div>
          <div
            className={`text-sm font-medium ${
              transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
            }`}
          >
            {transaction.type === "INCOME" ? "+" : "-"}$
            {Math.abs(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  );
};
