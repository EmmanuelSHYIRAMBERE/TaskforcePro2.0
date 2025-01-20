import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";
import { catchAsyncError } from "../utils/errorhandler.utils";
export class TransactionController {
  createTransaction = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("Body received", req.body);
      const transaction = await TransactionService.createTransaction({
        ...req.body,
        user: req.user!._id,
      });

      res.status(201).json({
        status: "success",
        data: transaction,
      });
    }
  );

  getTransactions = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const filters = req.query;
      const transactions = await TransactionService.getTransactions(
        req.user!._id.toString(),
        filters
      );

      res.status(200).json({
        status: "success",
        results: transactions.length,
        data: transactions,
      });
    }
  );

  generateReport = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { startDate, endDate } = req.query;
      const report = await TransactionService.generateReport(
        req.user!._id.toString(),
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        status: "success",
        data: report,
      });
    }
  );

  getTransactionsByCategory = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { startDate, endDate } = req.query;
      const summary = await TransactionService.getTransactionsByCategory(
        req.user!._id.toString(),
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        status: "success",
        data: summary,
      });
    }
  );
}
