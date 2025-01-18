import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

interface JwtPayload {
  _id: Schema.Types.ObjectId | string;
  email: string;
}

export const generateAccessToken = (data: JwtPayload): string => {
  const accessToken = jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXP_TIME,
  });

  return accessToken;
};

export const generateRefreshToken = (data: JwtPayload): string => {
  const refreshToken = jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXP_TIME,
  });

  return refreshToken;
};
