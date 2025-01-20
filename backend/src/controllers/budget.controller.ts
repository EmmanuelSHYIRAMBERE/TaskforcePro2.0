import { NextFunction, Request, Response } from "express";
import { BudgetService } from "../services/budget.service";
import { catchAsyncError } from "../utils/errorhandler.utils";

export class BudgetController {
  createBudget = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("req.body", req.body);

      const budget = await BudgetService.createBudget({
        ...req.body.extraArgument,
        user: req.user!._id,
      });

      res.status(201).json({
        status: "success",
        data: budget,
      });
    }
  );

  getBudgets = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const budgets = await BudgetService.getBudgets(
        req.user!._id.toString(),
        req.query
      );

      res.status(200).json({
        status: "success",
        results: budgets.length,
        data: budgets,
      });
    }
  );

  updateBudget = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const budget = await BudgetService.updateBudget(
        req.params.id,
        req.user!._id.toString(),
        req.body
      );

      res.status(200).json({
        status: "success",
        data: budget,
      });
    }
  );

  deleteBudget = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      await BudgetService.deleteBudget(req.params.id, req.user!._id.toString());

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );
}
