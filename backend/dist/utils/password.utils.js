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
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = yield bcrypt_1.default.genSalt(parseInt(process.env.saltRounds));
    let hashedPwd = yield bcrypt_1.default.hash(password, saltRounds);
    return hashedPwd;
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPwd) => __awaiter(void 0, void 0, void 0, function* () {
    let isPwdMatch = yield bcrypt_1.default.compare(password, hashedPwd);
    return isPwdMatch;
});
exports.comparePassword = comparePassword;
//# sourceMappingURL=password.utils.js.map