import { FilterQuery } from "mongoose";
import { Budget, IBudget } from "../models/budget.model";
import { NotificationService } from "./notification.service";

export class BudgetService {
  static async createBudget(data: Partial<IBudget>): Promise<IBudget> {
    // Validate required fields
    const requiredFields = [
      "user",
      "category",
      "amount",
      "period",
      "startDate",
      "endDate",
    ];
    requiredFields.forEach((field) => {
      if (!data[field as keyof Partial<IBudget>]) {
        throw new Error(`Missing required field: ${field}`);
      }
    });

    // Validate date ranges
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new Error("Start date cannot be after end date");
    }

    // Check for existing budget in same period and category
    const existingBudget = await Budget.findOne({
      user: data.user,
      category: data.category,
      $or: [
        {
          startDate: { $lte: data.startDate },
          endDate: { $gte: data.startDate },
        },
        {
          startDate: { $lte: data.endDate },
          endDate: { $gte: data.endDate },
        },
      ],
    });

    if (existingBudget) {
      throw new Error(
        "A budget already exists for this category and time period"
      );
    }

    return Budget.create(data);
  }

  static async getBudgets(userId: string, filters: FilterQuery<IBudget> = {}) {
    return Budget.find({ user: userId, ...filters })
      .populate("category", "name type")
      .sort({ startDate: -1 });
  }

  static async updateBudget(
    budgetId: string,
    userId: string,
    updates: Partial<IBudget>
  ) {
    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, user: userId },
      updates,
      { new: true, runValidators: true }
    ).populate("category", "name type");

    if (!budget) {
      throw new Error("Budget not found");
    }

    return budget;
  }

  static async deleteBudget(budgetId: string, userId: string) {
    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      user: userId,
    });
    if (!budget) {
      throw new Error("Budget not found");
    }
    return budget;
  }

  static async checkBudgetStatus(budgetId: string) {
    const budget = (await Budget.findById(budgetId).populate(
      "category",
      "name"
    )) as IBudget & { category: { name: string } };
    if (!budget) return;

    const percentageSpent = (budget.spent / budget.amount) * 100;

    // Send notifications at different thresholds
    if (percentageSpent >= 100 && budget.notifications) {
      await NotificationService.sendNotification({
        userId: budget.user,
        type: "BUDGET_EXCEEDED",
        title: "Budget Exceeded",
        message: `Your budget for ${budget.category.name} has been exceeded. Spent: ${budget.spent} of ${budget.amount}`,
        data: {
          budgetId: budget._id,
          category: budget.category.name,
          amount: budget.amount,
          spent: budget.spent,
        },
      });
    } else if (percentageSpent >= 90 && budget.notifications) {
      await NotificationService.sendNotification({
        userId: budget.user,
        type: "BUDGET_WARNING",
        title: "Budget Warning",
        message: `You've used 90% of your budget for ${budget.category.name}`,
        data: {
          budgetId: budget._id,
          category: budget.category.name,
          amount: budget.amount,
          spent: budget.spent,
        },
      });
    } else if (percentageSpent >= 75 && budget.notifications) {
      await NotificationService.sendNotification({
        userId: budget.user,
        type: "BUDGET_ALERT",
        title: "Budget Alert",
        message: `You've used 75% of your budget for ${budget.category.name}`,
        data: {
          budgetId: budget._id,
          category: budget.category.name,
          amount: budget.amount,
          spent: budget.spent,
        },
      });
    }
  }
}
