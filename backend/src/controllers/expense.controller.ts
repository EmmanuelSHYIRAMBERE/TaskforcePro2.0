import { NextFunction, Request, Response } from "express";
import { ExpenseService } from "../services/expense.service";
import { catchAsyncError } from "../utils/errorhandler.utils";

export class ExpenseController {
  createExpense = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const expense = await ExpenseService.createExpense({
        ...req.body,
        user: req.user!._id,
      });

      res.status(201).json({
        status: "success",
        data: expense,
      });
    }
  );

  getExpenses = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const expenses = await ExpenseService.getExpenses(
        req.user!._id.toString(),
        req.query
      );

      res.status(200).json({
        status: "success",
        results: expenses.length,
        data: expenses,
      });
    }
  );

  getExpenseById = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const expense = await ExpenseService.getExpenseById(
        req.params.id,
        req.user!._id.toString()
      );

      res.status(200).json({
        status: "success",
        data: expense,
      });
    }
  );

  updateExpense = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const expense = await ExpenseService.updateExpense(
        req.params.id,
        req.user!._id.toString(),
        req.body
      );

      res.status(200).json({
        status: "success",
        data: expense,
      });
    }
  );

  deleteExpense = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      await ExpenseService.deleteExpense(
        req.params.id,
        req.user!._id.toString()
      );

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );

  getExpensesByCategory = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const expenses = await ExpenseService.getExpensesByCategory(
        req.user!._id.toString(),
        req.params.categoryId
      );

      res.status(200).json({
        status: "success",
        results: expenses.length,
        data: expenses,
      });
    }
  );
}
