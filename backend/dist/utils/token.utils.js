"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (data) => {
    const accessToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXP_TIME,
    });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (data) => {
    const refreshToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXP_TIME,
    });
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=token.utils.js.map