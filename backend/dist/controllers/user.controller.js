"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_services_1 = require("../services/user.services");
const validators_1 = require("../utils/validators");
const password_utils_1 = require("../utils/password.utils");
const errorhandler_utils_1 = __importStar(require("../utils/errorhandler.utils"));
class userController {
    constructor() {
        this.createUser = (0, errorhandler_utils_1.catchAsyncError)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = validators_1.userValidationSchema.validate(req.body, {
                abortEarly: false,
            });
            if (error) {
                const errorMessage = error.details.map((err) => err.message).join(", ");
                return next(new errorhandler_utils_1.default({
                    message: errorMessage,
                    statusCode: 400,
                }));
            }
            const { email, password } = req.body;
            const userExists = yield this.userService.GetUserByEmail(email);
            if (userExists) {
                return next(new errorhandler_utils_1.default({
                    message: "User with this account already exists",
                    statusCode: 401,
                }));
            }
            let hashedPwd = "";
            hashedPwd = yield (0, password_utils_1.hashPassword)(password);
            req.body.password = hashedPwd;
            const user = yield this.userService.CreateUser(req.body);
            if (!user || !user._id) {
                return next(new errorhandler_utils_1.default({
                    message: "Failed to create user",
                    statusCode: 500,
                }));
            }
            res.status(201).json({ user });
        }));
        this.getUsers = (0, errorhandler_utils_1.catchAsyncError)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userService.GetAllUsers();
            res.status(200).json({ users });
        }));
        this.getUserById = (0, errorhandler_utils_1.catchAsyncError)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const user = yield this.userService.GetUserById(userId);
            if (!user) {
                return next(new errorhandler_utils_1.default({
                    message: "User not found",
                    statusCode: 404,
                }));
            }
            res.status(200).json({ user });
        }));
        this.updateUser = (0, errorhandler_utils_1.catchAsyncError)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const updateData = req.body;
            const { error } = validators_1.userValidationSchema.validate(updateData, {
                abortEarly: false,
            });
            if (error) {
                const errorMessage = error.details.map((err) => err.message).join(", ");
                return next(new errorhandler_utils_1.default({
                    message: errorMessage,
                    statusCode: 400,
                }));
            }
            if (updateData.password) {
                updateData.password = yield (0, password_utils_1.hashPassword)(updateData.password);
            }
            const updatedUser = yield this.userService.UpdateUser(userId, updateData);
            if (!updatedUser) {
                return next(new errorhandler_utils_1.default({
                    message: "User not found",
                    statusCode: 404,
                }));
            }
            res.status(200).json({ user: updatedUser });
        }));
        this.deleteUser = (0, errorhandler_utils_1.catchAsyncError)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const deletedUser = yield this.userService.DeleteUser(userId);
            if (!deletedUser) {
                return next(new errorhandler_utils_1.default({
                    message: "User not found",
                    statusCode: 404,
                }));
            }
            res.status(200).send("deleted successfully");
        }));
        this.userService = new user_services_1.UserService();
    }
}
exports.userController = userController;
//# sourceMappingURL=user.controller.js.map