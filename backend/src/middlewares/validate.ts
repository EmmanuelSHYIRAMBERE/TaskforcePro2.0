import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(new ApiError(400, "Invalid request data"));
    }
  };
