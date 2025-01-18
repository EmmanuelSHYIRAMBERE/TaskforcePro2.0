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

      if (data.amount === undefined) {
        throw new Error("Transaction amount is required");
      }

      const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;
      account.balance += balanceChange;
      await account.save({ session });

      // Update budget if it exists
      if (data.type === "EXPENSE") {
        const budget = await Budget.findOne({
          category: data.category,
          startDate: { $lte: data.date },
          endDate: { $gte: data.date },
        });

        if (budget) {
          budget.spent += data.amount;
          await budget.save({ session });

          // Check if budget exceeded
          if (budget.spent > budget.amount && budget.notifications) {
            await NotificationService.sendBudgetAlert(budget);
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

  static async getTransactions(userId: string, filters: any = {}) {
    const query = { user: userId, ...filters };
    return Transaction.find(query)
      .populate("account")
      .populate("category")
      .sort({ date: -1 });
  }

  static async getTransactionsSummary(
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
          _id: {
            type: "$type",
            category: "$category",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);
  }
}
