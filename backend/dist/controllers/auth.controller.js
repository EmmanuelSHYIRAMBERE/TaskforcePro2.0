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
const errorhandler_utils_1 = __importDefault(require("../utils/errorhandler.utils"));
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.logIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return next(new errorhandler_utils_1.default({
                        message: "Please provide email and password",
                        statusCode: 400,
                    }));
                }
                const result = yield this.authService.logIn(email, password);
                res.cookie("refreshToken", result.refreshToken, {
                    maxAge: 31104000000,
                    httpOnly: true,
                });
                res.status(200).json({
                    message: "User logged in successfully!",
                    access_token: result.accessToken,
                    user: result.user,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.changePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { existingPassword, newPassword } = req.body;
                const userId = req.user._id;
                yield this.authService.changePassword(userId, existingPassword, newPassword);
                res.status(200).json({
                    message: "Password changed successfully!",
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const resetPasswordOTP = yield this.authService.forgotPassword(email);
                res.status(200).json({
                    status: "success",
                    OTP: resetPasswordOTP,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, newPassword } = req.body;
                const token = yield this.authService.resetPassword(email, otp, newPassword);
                res.status(200).json({
                    message: "Success, password updated!",
                    access_token: token,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.logout = (req, res, next) => {
            this.authService.logout(req, res);
            res.status(200).json({
                message: "User logged out successfully!",
            });
        };
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map