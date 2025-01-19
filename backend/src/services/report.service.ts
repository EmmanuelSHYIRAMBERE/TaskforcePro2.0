import { FilterQuery } from "mongoose";
import { Report, IReport } from "../models/report.model";
import { Transaction } from "../models/transaction.model";
import { Category } from "../models/category.model";
import { Account } from "../models/account.model";

export class ReportService {
  static async generateReport(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IReport> {
    // Get all transactions within the date range
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
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

    // Calculate account breakdown
    const accountBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$account",
          totalAmount: { $sum: "$amount" },
          transactions: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "_id",
          as: "accountInfo",
        },
      },
    ]);

    // Create and save report
    const report = await Report.create({
      user: userId,
      startDate,
      endDate,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryBreakdown: categoryBreakdown.map((cat) => ({
        category: cat._id,
        amount: cat.amount,
        percentage: (cat.amount / totalExpense) * 100,
      })),
      accountBreakdown: accountBreakdown.map((acc) => ({
        account: acc._id,
        balance: acc.totalAmount,
        transactions: acc.transactions,
      })),
      transactions: transactions.map((t) => t._id),
      generatedAt: new Date(),
    });

    return report.populate([
      { path: "categoryBreakdown.category", select: "name type" },
      { path: "accountBreakdown.account", select: "name type" },
      { path: "transactions", select: "type amount date description" },
    ]);
  }

  static async getReports(userId: string, filters: FilterQuery<IReport> = {}) {
    return Report.find({ user: userId, ...filters })
      .populate("categoryBreakdown.category", "name type")
      .populate("accountBreakdown.account", "name type")
      .sort({ generatedAt: -1 });
  }

  static async getReportById(reportId: string, userId: string) {
    return Report.findOne({ _id: reportId, user: userId })
      .populate("categoryBreakdown.category", "name type")
      .populate("accountBreakdown.account", "name type")
      .populate("transactions", "type amount date description");
  }
}
