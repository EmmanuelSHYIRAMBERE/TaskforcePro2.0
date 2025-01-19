"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const user_model_ts_1 = require("../models/user.model.ts");
const errorhandler_utils_1 = __importDefault(require("../utils/errorhandler.utils"));
const password_utils_1 = require("../utils/password.utils");
const token_utils_1 = require("../utils/token.utils");
class AuthService {
    generateOTP(expiryMinutes = 10) {
        const otp = crypto_1.default.randomInt(100000, 999999);
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
        return {
            code: otp.toString(),
            expiresAt: expiryTime,
        };
    }
    logIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_ts_1.User.findOne({ email });
            if (!user) {
                throw new errorhandler_utils_1.default({ message: `User not found`, statusCode: 404 });
            }
            let isPwdMatch = yield (0, password_utils_1.comparePassword)(password, user.password);
            if (!isPwdMatch) {
                throw new errorhandler_utils_1.default({
                    message: `Incorrect password. Please try again.`,
                    statusCode: 401,
                });
            }
            const { _id, name, phone, role } = user;
            const accessToken = (0, token_utils_1.generateAccessToken)({ _id, email });
            const refreshToken = (0, token_utils_1.generateRefreshToken)({ _id, email });
            return {
                accessToken,
                refreshToken,
                user: { userId: _id, email, name, phone, role },
            };
        });
    }
    changePassword(userId, existingPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_ts_1.User.findById(userId);
            if (!user) {
                throw new errorhandler_utils_1.default({
                    message: "Please log in first!",
                    statusCode: 400,
                });
            }
            let pwdCheck = yield (0, password_utils_1.comparePassword)(existingPassword, user.password);
            if (!pwdCheck) {
                throw new errorhandler_utils_1.default({
                    message: "Incorrect password. Please try again.",
                    statusCode: 401,
                });
            }
            let hashedPwd = yield (0, password_utils_1.hashPassword)(newPassword);
            user.password = hashedPwd;
            yield user.save();
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_ts_1.User.findOne({ email });
            if (!user) {
                throw new errorhandler_utils_1.default({
                    message: `We could not find the user with email: ${email}`,
                    statusCode: 404,
                });
            }
            const resetPasswordOTP = this.generateOTP().code;
            user.otp = resetPasswordOTP;
            user.otpexpire = this.generateOTP().expiresAt;
            yield user.save();
            return resetPasswordOTP;
        });
    }
    resetPassword(email, otp, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_ts_1.User.findOne({ email });
            if (!user) {
                throw new errorhandler_utils_1.default({
                    message: `user with the email: ${email} not exists, try others`,
                    statusCode: 409,
                });
            }
            if (user.otp !== otp) {
                throw new errorhandler_utils_1.default({
                    message: `Dear user the otp entered ${otp} is not correct`,
                    statusCode: 401,
                });
            }
            const { otpexpire } = user;
            const currentDateTime = new Date();
            if (otpexpire && otpexpire < currentDateTime) {
                throw new errorhandler_utils_1.default({
                    message: `The provided otp: ${otp} has been expired, please try again.`,
                    statusCode: 401,
                });
            }
            let hashedPwd = yield (0, password_utils_1.hashPassword)(newPassword);
            user.password = hashedPwd;
            user.otp = null;
            user.otpexpire = null;
            yield user.save();
            return (0, token_utils_1.generateAccessToken)({ _id: user._id, email: user.email });
        });
    }
    logout(req, res) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        req.token = {};
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map