import { Schema } from "mongoose";
import { NextFunction, Request, Response } from "express";

import { User } from "../models/user.model.ts";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utils";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      _id: Schema.Types.ObjectId;
      email: string;
    };
  }
}
export const adminauthorization = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return next(
        new errorHandler({
          message: "Login again, your session might be ended!",
          statusCode: 404,
        })
      );
    }

    const role: string = user.role;

    if (role !== "admin") {
      return next(
        new errorHandler({
          message: "You are not authorized!",
          statusCode: 403,
        })
      );
    }

    next();
  }
);
