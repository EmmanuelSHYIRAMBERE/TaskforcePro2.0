import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { catchAsyncError } from "../utils/errorhandler.utils";

export class CategoryController {
  createCategory = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await CategoryService.createCategory({
        ...req.body,
        user: req.user!._id,
      });

      res.status(201).json({
        status: "success",
        data: category,
      });
    }
  );

  getCategories = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const categories = await CategoryService.getCategories(
        req.user!._id.toString(),
        req.query
      );

      res.status(200).json({
        status: "success",
        results: categories.length,
        data: categories,
      });
    }
  );

  getCategoryById = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await CategoryService.getCategoryById(
        req.params.id,
        req.user!._id.toString()
      );

      res.status(200).json({
        status: "success",
        data: category,
      });
    }
  );

  updateCategory = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await CategoryService.updateCategory(
        req.params.id,
        req.user!._id.toString(),
        req.body
      );

      res.status(200).json({
        status: "success",
        data: category,
      });
    }
  );

  deleteCategory = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      await CategoryService.deleteCategory(
        req.params.id,
        req.user!._id.toString()
      );

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );

  getCategoryHierarchy = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const hierarchy = await CategoryService.getCategoryHierarchy(
        req.user!._id.toString()
      );

      res.status(200).json({
        status: "success",
        data: hierarchy,
      });
    }
  );
}
