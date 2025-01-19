import { FilterQuery } from "mongoose";
import { Expense, IExpense } from "../models/expense.model";
import { Category } from "../models/category.model";

export class ExpenseService {
  static async createExpense(data: Partial<IExpense>): Promise<IExpense> {
    // Validate category type
    const category = await Category.findById(data.category);
    if (!category || category.type !== "EXPENSE") {
      throw new Error("Invalid expense category");
    }

    const expense = await Expense.create(data);
    return expense.populate(["category", "subcategory"]);
  }

  static async getExpenses(
    userId: string,
    filters: FilterQuery<IExpense> = {}
  ) {
    return Expense.find({ user: userId, ...filters })
      .populate(["category", "subcategory"])
      .sort({ date: -1 });
  }

  static async getExpenseById(expenseId: string, userId: string) {
    const expense = await Expense.findOne({
      _id: expenseId,
      user: userId,
    }).populate(["category", "subcategory"]);

    if (!expense) {
      throw new Error("Expense not found");
    }
    return expense;
  }

  static async updateExpense(
    expenseId: string,
    userId: string,
    updates: Partial<IExpense>
  ) {
    if (updates.category) {
      const category = await Category.findById(updates.category);
      if (!category || category.type !== "EXPENSE") {
        throw new Error("Invalid expense category");
      }
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: expenseId, user: userId },
      updates,
      { new: true, runValidators: true }
    ).populate(["category", "subcategory"]);

    if (!expense) {
      throw new Error("Expense not found");
    }
    return expense;
  }

  static async deleteExpense(expenseId: string, userId: string) {
    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      user: userId,
    });

    if (!expense) {
      throw new Error("Expense not found");
    }
    return expense;
  }

  static async getExpensesByCategory(userId: string, categoryId: string) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    // Get expenses for both the category and its subcategories
    const subcategories = await Category.find({ parent: categoryId });
    const categoryIds = [categoryId, ...subcategories.map((sub) => sub._id)];

    return Expense.find({
      user: userId,
      category: { $in: categoryIds },
    }).populate(["category", "subcategory"]);
  }
}
