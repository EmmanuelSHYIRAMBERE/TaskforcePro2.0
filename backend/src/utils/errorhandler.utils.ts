import { NextFunction, Request, Response } from "express";

interface Error {
  message: string;
  statusCode: number;
}

export default class errorHandler extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor({ message, statusCode }: Error) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsyncError = (asyncFunction: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncFunction(req, res, next).catch(next);
  };
};
