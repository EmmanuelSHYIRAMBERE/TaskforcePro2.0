import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.utils";
import errorHandler from "../utils/errorhandler.utils";

interface Error {
  value?: string | number;
  path?: string | number;
  reason?: string | number;
  stringValue?: string | number;
}

export const globalErrorController = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.name === "CastError") err = handCastError(err);
  if (err.name === "ValidationError") err = handleValidationErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);

  console.log("Error occurred:", err);
  logger.error(err);

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
  });
};

export const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}`;
  return new errorHandler({ message, statusCode: 400 });
};

export const handCastError = (err: Error) => {
  const message = `Invalid input data ${err.stringValue} because of ${err.reason}`;
  return new errorHandler({ message, statusCode: 400 });
};

export const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => {
    return `Invalid input data: "${el.value}" at path "${el.path}"`;
  });

  const message = errors.join(". ").replace(/\\"/g, '"');
  return new errorHandler({ message, statusCode: 400 });
};
