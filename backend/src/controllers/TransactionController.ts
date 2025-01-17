// src/controllers/TransactionController.ts
import { Request, Response } from "express";
import Transaction from "../models/Transaction";
import Account from "../models/Account";
import Budget from "../models/Budget";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: string;
    };
  }
}

export class TransactionController {
  // Create new transaction
  static async create(req: Request, res: Response) {
    try {
      const { accountId, categoryId, amount, type, description } = req.body;
      const userId = req.user.id;

      // Create transaction
      const transaction = new Transaction({
        userId,
        accountId,
        categoryId,
        amount,
        type,
        description,
        date: new Date(),
      });

      // Update account balance
      const account = await Account.findById(accountId);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      account.balance += type === "income" ? amount : -amount;
      await account.save();
      await transaction.save();

      // Check budget alerts
      if (type === "expense") {
        const budget = await Budget.findOne({
          userId,
          categoryId,
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() },
        });

        if (budget) {
          const totalExpenses = await Transaction.aggregate([
            {
              $match: {
                userId,
                categoryId,
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

          if (totalExpenses[0]?.total > budget.amount) {
            // In a real application, you would implement notification logic here
            console.log("Budget exceeded for category:", categoryId);
          }
        }
      }

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Error creating transaction", error });
    }
  }

  // Get transactions with filtering and pagination
  static async getTransactions(req: Request, res: Response) {
    try {
      const {
        startDate,
        endDate,
        accountId,
        categoryId,
        type,
        page = 1,
        limit = 10,
      } = req.query;
      const userId = req.user.id;

      const query: any = { userId };

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }
      if (accountId) query.accountId = accountId;
      if (categoryId) query.categoryId = categoryId;
      if (type) query.type = type;

      const transactions = await Transaction.find(query)
        .sort({ date: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate("categoryId")
        .populate("accountId");

      const total = await Transaction.countDocuments(query);

      res.json({
        transactions,
        total,
        pages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions", error });
    }
  }

  // Get transaction summary
  static async getSummary(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;

      const summary = await Transaction.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: new Date(startDate as string),
              $lte: new Date(endDate as string),
            },
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
      ]);

      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Error getting summary", error });
    }
  }
}
