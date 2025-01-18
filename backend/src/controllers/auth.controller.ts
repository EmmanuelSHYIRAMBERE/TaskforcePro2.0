import { Schema } from "mongoose";
import { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/errorhandler.utils";
import AuthService from "../services/auth.service";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      _id: Schema.Types.ObjectId;
      email: string;
    };
  }
}

class AuthController {
  constructor(private authService: AuthService) {}

  logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(
          new errorHandler({
            message: "Please provide email and password",
            statusCode: 400,
          })
        );
      }

      const result = await this.authService.logIn(email, password);

      res.cookie("refreshToken", result.refreshToken, {
        maxAge: 31104000000,
        httpOnly: true,
      });

      res.status(200).json({
        message: "User logged in successfully!",
        access_token: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { existingPassword, newPassword } = req.body;
      const userId = req.user._id;

      await this.authService.changePassword(
        userId,
        existingPassword,
        newPassword
      );

      res.status(200).json({
        message: "Password changed successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const resetPasswordOTP = await this.authService.forgotPassword(email);

      res.status(200).json({
        status: "success",
        OTP: resetPasswordOTP,
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp, newPassword } = req.body;
      const token = await this.authService.resetPassword(
        email,
        otp,
        newPassword
      );

      res.status(200).json({
        message: "Success, password updated!",
        access_token: token,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = (req: Request, res: Response, next: NextFunction) => {
    this.authService.logout(req, res);
    res.status(200).json({
      message: "User logged out successfully!",
    });
  };
}

export default AuthController;
