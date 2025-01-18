import Budget from "../models/Budget";
import Transaction from "../models/Transaction";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";

export class BudgetService {
  static async checkBudgetStatus(userId: string, categoryId: string) {
    const budget = await Budget.findOne({
      userId,
      categoryId,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!budget) {
      return null;
    }

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          categoryId: new Types.ObjectId(categoryId),
          type: "expense",
          date: { $gte: budget.startDate, $lte: budget.endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalSpent = expenses[0]?.total || 0;
    const remainingBudget = budget.amount - totalSpent;
    const isExceeded = totalSpent > budget.amount;

    return {
      budgetId: budget._id,
      allocated: budget.amount,
      spent: totalSpent,
      remaining: remainingBudget,
      isExceeded,
    };
  }
}
