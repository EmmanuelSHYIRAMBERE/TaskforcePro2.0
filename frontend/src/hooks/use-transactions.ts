import { useWallet } from "@/context/WalletContext";
import { Transaction, TransactionType } from "@/lib/types";
import { useState, useCallback } from "react";

export const useTransactions = () => {
  const { state, dispatch } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTransaction = useCallback(
    async (
      transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
    ) => {
      setLoading(true);
      setError(null);
      try {
        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });

        // Update account balance
        const amount =
          transaction.type === "income"
            ? transaction.amount
            : -transaction.amount;
        const account = state.accounts.find(
          (a) => a.id === transaction.accountId
        );
        if (account) {
          dispatch({
            type: "UPDATE_ACCOUNT_BALANCE",
            payload: {
              accountId: account.id,
              balance: account.balance + amount,
            },
          });
        }

        // Check budget limits
        const budget = state.budgets.find(
          (b) => b.categoryId === transaction.categoryId
        );
        if (budget && transaction.type === "expense") {
          const newSpent = budget.spent + transaction.amount;
          if (newSpent > budget.amount) {
            // Trigger notification
            new Notification("Budget Alert", {
              body: `You have exceeded your budget for ${
                state.categories.find((c) => c.id === transaction.categoryId)
                  ?.name
              }`,
            });
          }
          dispatch({
            type: "UPDATE_BUDGET",
            payload: {
              ...budget,
              spent: newSpent,
            },
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to add transaction"
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch, state.accounts, state.budgets, state.categories]
  );

  const getTransactionsByDateRange = useCallback(
    (startDate: string, endDate: string) => {
      return state.transactions.filter(
        (transaction) =>
          transaction.date >= startDate && transaction.date <= endDate
      );
    },
    [state.transactions]
  );

  const getTransactionsByCategory = useCallback(
    (categoryId: string) => {
      return state.transactions.filter(
        (transaction) => transaction.categoryId === categoryId
      );
    },
    [state.transactions]
  );

  const getTransactionsByAccount = useCallback(
    (accountId: string) => {
      return state.transactions.filter(
        (transaction) => transaction.accountId === accountId
      );
    },
    [state.transactions]
  );

  const getTotalsByType = useCallback(
    (type: TransactionType) => {
      return state.transactions
        .filter((transaction) => transaction.type === type)
        .reduce((total, transaction) => total + transaction.amount, 0);
    },
    [state.transactions]
  );

  return {
    transactions: state.transactions,
    loading,
    error,
    addTransaction,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    getTransactionsByAccount,
    getTotalsByType,
  };
};
