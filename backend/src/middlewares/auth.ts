import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import User from "../models/User";

export interface AuthRequest extends Request {
  user: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Not authorized to access this route");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    next(new ApiError(401, "Not authorized to access this route"));
  }
};
