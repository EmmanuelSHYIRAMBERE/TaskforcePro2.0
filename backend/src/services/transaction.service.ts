import { FilterQuery, Schema } from "mongoose";
import { Account } from "../models/account.model";
import { Budget } from "../models/budget.model";
import { ITransaction, Transaction } from "../models/transaction.model";
import { NotificationService } from "./notification.service";

export class TransactionService {
  static async createTransaction(data: Partial<ITransaction>) {
    const session = await Transaction.startSession();
    session.startTransaction();

    try {
      const transaction = new Transaction(data);
      await transaction.save({ session });

      // Update account balance
      const account = await Account.findById(data.account);
      if (!account) throw new Error("Account not found");

      const balanceChange =
        data.type === "INCOME" ? data.amount! : -data.amount!;
      account.balance += balanceChange;
      await account.save({ session });

      // Check budget limits and send notifications
      if (data.type === "EXPENSE") {
        const budget = await Budget.findOne({
          user: data.user,
          category: data.category,
          startDate: { $lte: data.date },
          endDate: { $gte: data.date },
        });

        if (budget) {
          budget.spent += data.amount!;
          await budget.save({ session });

          if (budget.spent > budget.amount) {
            await NotificationService.sendBudgetAlert({
              userId: data.user!.toString(),
              budgetId: budget._id as Schema.Types.ObjectId,
              category: budget.category as Schema.Types.ObjectId,
              overspentAmount: budget.spent - budget.amount,
            });
          }
        }
      }

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getTransactions(
    userId: string,
    filters: FilterQuery<ITransaction> = {}
  ) {
    const query = { user: userId, ...filters };
    return Transaction.find(query)
      .populate("account", "name type")
      .populate("category", "name type")
      .populate("subcategory", "name")
      .sort({ date: -1 });
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
    ]);
  }
}
