import jwt, { VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Schema } from "mongoose";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utils";
import { generateAccessToken } from "../utils/token.utils";

interface VerifiedUser {
  _id: Schema.Types.ObjectId;
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    token?: {
      accessToken?: string;
      refreshToken?: string;
    };
  }
}

export const refreshAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(
        new errorHandler({
          message: "Your session has expired, you need to log in again.",
          statusCode: 401,
        })
      );
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string,
      (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          return next(
            new errorHandler({
              message: "Your session has expired, you need to log in again.",
              statusCode: 403,
            })
          );
        }

        if (!decoded || typeof decoded !== "object") {
          return next(
            new errorHandler({
              message: "Your session has expired, you need to log in again.",
              statusCode: 401,
            })
          );
        }

        const verified = decoded as VerifiedUser;

        const newAccessToken = generateAccessToken({
          _id: verified._id,
          email: verified.email,
        });

        res.cookie("accessToken", newAccessToken, {
          maxAge: 30000,
          httpOnly: true,
        });

        if (!req.token) {
          req.token = {};
        }

        req.token.accessToken = newAccessToken;

        next();
      }
    );
  }
);

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken: tokenFromCookie } = req.cookies;
    const tokenFromRequest = req.token?.accessToken;
    const authorization = req.headers.authorization;

    if (!authorization && !tokenFromCookie && !tokenFromRequest) {
      return next(
        new errorHandler({
          message: "User not authenticated.",
          statusCode: 401,
        })
      );
    }

    const token =
      tokenFromRequest ||
      tokenFromCookie ||
      (authorization ? authorization.split(" ")[1] : null);

    if (!token) {
      return next(
        new errorHandler({
          message: "Please provide a valid access token.",
          statusCode: 401,
        })
      );
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          console.error("Token verification error:", err);
          return next(
            new errorHandler({
              message: "Invalid access token.",
              statusCode: 401,
            })
          );
        }

        if (!decoded || typeof decoded !== "object") {
          return next(
            new errorHandler({
              message: "Invalid access token data.",
              statusCode: 401,
            })
          );
        }

        const verified = decoded as VerifiedUser;

        req.user = {
          _id: verified._id,
          email: verified.email,
        };
        next();
      }
    );
  } catch (error) {
    next(
      new errorHandler({
        message: "Failed to verify token.",
        statusCode: 500,
      })
    );
  }
};
