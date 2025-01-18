import Transaction from "../models/Transaction";
import Account from "../models/Account";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";

export class TransactionService {
  static async createTransaction(userId: string, data: any) {
    const session = await Transaction.startSession();
    session.startTransaction();

    try {
      const { accountId, amount, type } = data;

      const account = await Account.findOne({
        _id: accountId,
        userId,
      });

      if (!account) {
        throw new ApiError(404, "Account not found");
      }

      // Update account balance
      const balanceChange = type === "income" ? amount : -amount;
      account.balance += balanceChange;

      if (account.balance < 0 && account.type !== "credit-card") {
        throw new ApiError(400, "Insufficient funds");
      }

      await account.save({ session });

      // Create transaction
      const transaction = await Transaction.create(
        [
          {
            ...data,
            userId,
            date: data.date || new Date(),
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return transaction[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getTransactionSummary(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            category: "$categoryId",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id.category",
          foreignField: "_id",
          as: "category",
        },
      },
    ]);

    return summary;
  }
}
