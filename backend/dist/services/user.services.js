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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_ts_1 = require("../models/user.model.ts");
class UserService {
    CreateUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = userData;
            const existingUser = yield user_model_ts_1.User.findOne({ email: email });
            if (existingUser) {
                throw new Error("User already exists");
            }
            const newUser = yield user_model_ts_1.User.create(userData);
            return newUser;
        });
    }
    GetUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_ts_1.User.findOne({ email: email });
            return user;
        });
    }
    GetAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield user_model_ts_1.User.find({});
            return allUsers;
        });
    }
    GetUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_ts_1.User.findById(userId);
            return user;
        });
    }
    UpdateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield user_model_ts_1.User.findByIdAndUpdate(userId, updateData, {
                new: true,
            });
            return updatedUser;
        });
    }
    DeleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield user_model_ts_1.User.findByIdAndDelete(userId);
            return deletedUser;
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.services.js.map