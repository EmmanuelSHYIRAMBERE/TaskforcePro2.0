import { Budget, IBudget } from "../models/budget.model";
import { NotificationService } from "./notification.service";

export class BudgetService {
  static async createBudget(data: Partial<IBudget>) {
    const budget = new Budget(data);
    await budget.save();
    return budget;
  }

  static async getBudgets(userId: string) {
    return Budget.find({ user: userId }).populate("category");
  }

  static async checkBudgetStatus(userId: string) {
    const budgets = await Budget.find({
      user: userId,
      notifications: true,
      endDate: { $gte: new Date() },
    });

    for (const budget of budgets) {
      if (budget.spent > budget.amount) {
        await NotificationService.sendBudgetAlert(budget);
      }
    }
  }
}
