import { FilterQuery, Schema } from "mongoose";
import { Account } from "../models/account.model";
import { Budget } from "../models/budget.model";
import { ITransaction, Transaction } from "../models/transaction.model";
import { NotificationService } from "./notification.service";

export class TransactionService {
  static async createTransaction(data: Partial<ITransaction>) {
    try {
      // 1. Validate the account exists and has sufficient balance for expenses
      const account = await Account.findById(data.account);
      if (!account) {
        throw new Error("Account not found");
      }

      const balanceChange =
        data.type === "INCOME" ? data.amount! : -data.amount!;
      const newBalance = account.balance + balanceChange;

      if (data.type === "EXPENSE" && newBalance < 0) {
        throw new Error("Insufficient balance in account");
      }

      // 2. Create the transaction
      const transaction = await Transaction.create(data);

      // 3. Update account balance
      account.balance = newBalance;
      await account.save();

      // 4. Check budget limits and send notifications for expenses
      if (data.type === "EXPENSE") {
        await this.handleBudgetCheck(data);
      }

      return transaction;
    } catch (error) {
      // If any error occurs, we need to handle it appropriately
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error creating transaction");
    }
  }

  private static async handleBudgetCheck(data: Partial<ITransaction>) {
    try {
      const budget = await Budget.findOne({
        user: data.user,
        category: data.category,
        startDate: { $lte: data.date },
        endDate: { $gte: data.date },
      });

      if (budget) {
        const newSpent = budget.spent + data.amount!;
        budget.spent = newSpent;
        await budget.save();

        if (newSpent > budget.amount) {
          await NotificationService.sendBudgetAlert({
            userId: data.user!.toString(),
            budgetId: budget._id as Schema.Types.ObjectId,
            category: budget.category as Schema.Types.ObjectId,
            overspentAmount: newSpent - budget.amount,
          });
        }
      }
    } catch (error) {
      console.error("Budget check failed:", error);
      // We don't throw here as it's not critical to transaction creation
    }
  }

  static async getTransactions(
    userId: string,
    filters: FilterQuery<ITransaction> = {}
  ) {
    const query = { user: userId, ...filters };
    const transactions = await Transaction.find(query)
      .populate("account", "name type")
      .populate("category", "name type")
      .populate("subcategory", "name")
      .sort({ date: -1 });

    return transactions;
  }

  static async generateReport(userId: string, startDate: Date, endDate: Date) {
    const pipeline = [
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            category: "$category",
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          transactions: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $addFields: {
          categoryInfo: { $arrayElemAt: ["$categoryInfo", 0] },
        },
      },
      {
        $sort: {
          "_id.year": 1 as 1 | -1,
          "_id.month": 1 as 1 | -1,
          total: -1 as 1 | -1,
        },
      },
    ];

    return Transaction.aggregate(pipeline);
  }

  static async getTransactionsByCategory(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    return Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          transactions: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $addFields: {
          categoryInfo: { $arrayElemAt: ["$categoryInfo", 0] },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }
}
