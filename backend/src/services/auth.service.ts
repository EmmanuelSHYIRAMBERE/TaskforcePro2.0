import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

import { ObjectId } from "mongoose";
import { User } from "../models/user.model.ts";
import errorHandler from "../utils/errorhandler.utils";
import { comparePassword, hashPassword } from "../utils/password.utils";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utils";

class AuthService {
  generateOTP(expiryMinutes = 10) {
    const otp = crypto.randomInt(100000, 999999);
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);

    return {
      code: otp.toString(),
      expiresAt: expiryTime,
    };
  }

  async logIn(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new errorHandler({ message: `User not found`, statusCode: 404 });
    }

    let isPwdMatch = await comparePassword(password, user.password);

    if (!isPwdMatch) {
      throw new errorHandler({
        message: `Incorrect password. Please try again.`,
        statusCode: 401,
      });
    }

    const { _id, name, phone, role } = user;

    const accessToken = generateAccessToken({ _id, email });
    const refreshToken = generateRefreshToken({ _id, email });

    return {
      accessToken,
      refreshToken,
      user: { userId: _id, email, name, phone, role },
    };
  }

  async changePassword(
    userId: ObjectId,
    existingPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new errorHandler({
        message: "Please log in first!",
        statusCode: 400,
      });
    }

    let pwdCheck = await comparePassword(existingPassword, user.password);

    if (!pwdCheck) {
      throw new errorHandler({
        message: "Incorrect password. Please try again.",
        statusCode: 401,
      });
    }

    let hashedPwd = await hashPassword(newPassword);
    user.password = hashedPwd;
    await user.save();
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new errorHandler({
        message: `We could not find the user with email: ${email}`,
        statusCode: 404,
      });
    }

    const resetPasswordOTP = this.generateOTP().code;

    user.otp = resetPasswordOTP;
    user.otpexpire = this.generateOTP().expiresAt;

    await user.save();

    return resetPasswordOTP;
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new errorHandler({
        message: `user with the email: ${email} not exists, try others`,
        statusCode: 409,
      });
    }

    if (user.otp !== otp) {
      throw new errorHandler({
        message: `Dear user the otp entered ${otp} is not correct`,
        statusCode: 401,
      });
    }

    const { otpexpire } = user;
    const currentDateTime = new Date();

    if (otpexpire && otpexpire < currentDateTime) {
      throw new errorHandler({
        message: `The provided otp: ${otp} has been expired, please try again.`,
        statusCode: 401,
      });
    }

    let hashedPwd = await hashPassword(newPassword);

    user.password = hashedPwd;
    user.otp = null;
    user.otpexpire = null;

    await user.save();

    return generateAccessToken({ _id: user._id, email: user.email });
  }

  logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    req.token = {};
  }
}

export default AuthService;
