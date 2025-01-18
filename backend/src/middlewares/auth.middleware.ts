import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.ts";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById((decoded as jwt.JwtPayload).id);
    if (!user) throw new Error("User not found");

    req.user = { id: user._id.toString(), ...user.toObject() };
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};
