import { NextFunction, Request, Response } from "express";
import { AccountService } from "../services/account.service";
import { catchAsyncError } from "../utils/errorhandler.utils";

export class AccountController {
  createAccount = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const account = await AccountService.createAccount({
        ...req.body,
        user: req.user!._id,
      });

      res.status(201).json({
        status: "success",
        data: account,
      });
    }
  );

  getAccounts = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const accounts = await AccountService.getAccounts(
        req.user!._id.toString()
      );

      res.status(200).json({
        status: "success",
        results: accounts.length,
        data: accounts,
      });
    }
  );

  getAccount = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const account = await AccountService.getAccountById(
        req.params.id,
        req.user!._id.toString()
      );

      res.status(200).json({
        status: "success",
        data: account,
      });
    }
  );

  updateAccount = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const account = await AccountService.updateAccount(
        req.params.id,
        req.user!._id.toString(),
        req.body
      );

      res.status(200).json({
        status: "success",
        data: account,
      });
    }
  );

  deleteAccount = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      await AccountService.deleteAccount(
        req.params.id,
        req.user!._id.toString()
      );

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );

  getAccountBalance = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const balance = await AccountService.getAccountBalance(
        req.params.id,
        req.user!._id.toString()
      );

      res.status(200).json({
        status: "success",
        data: balance,
      });
    }
  );
}
