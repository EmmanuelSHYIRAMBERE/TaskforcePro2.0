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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.verifyAccessToken = exports.refreshAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorhandler_utils_1 = __importStar(require("../utils/errorhandler.utils"));
const token_utils_1 = require("../utils/token.utils");
exports.refreshAccessToken = (0, errorhandler_utils_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return next(new errorhandler_utils_1.default({
            message: "Your session has expired, you need to log in again.",
            statusCode: 401,
        }));
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new errorhandler_utils_1.default({
                message: "Your session has expired, you need to log in again.",
                statusCode: 403,
            }));
        }
        if (!decoded || typeof decoded !== "object") {
            return next(new errorhandler_utils_1.default({
                message: "Your session has expired, you need to log in again.",
                statusCode: 401,
            }));
        }
        const verified = decoded;
        const newAccessToken = (0, token_utils_1.generateAccessToken)({
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
    });
}));
const verifyAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { accessToken: tokenFromCookie } = req.cookies;
        const tokenFromRequest = (_a = req.token) === null || _a === void 0 ? void 0 : _a.accessToken;
        const authorization = req.headers.authorization;
        if (!authorization && !tokenFromCookie && !tokenFromRequest) {
            return next(new errorhandler_utils_1.default({
                message: "User not authenticated.",
                statusCode: 401,
            }));
        }
        const token = tokenFromRequest ||
            tokenFromCookie ||
            (authorization ? authorization.split(" ")[1] : null);
        if (!token) {
            return next(new errorhandler_utils_1.default({
                message: "Please provide a valid access token.",
                statusCode: 401,
            }));
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err);
                return next(new errorhandler_utils_1.default({
                    message: "Invalid access token.",
                    statusCode: 401,
                }));
            }
            if (!decoded || typeof decoded !== "object") {
                return next(new errorhandler_utils_1.default({
                    message: "Invalid access token data.",
                    statusCode: 401,
                }));
            }
            const verified = decoded;
            req.user = {
                _id: verified._id,
                email: verified.email,
            };
            next();
        });
    }
    catch (error) {
        next(new errorhandler_utils_1.default({
            message: "Failed to verify token.",
            statusCode: 500,
        }));
    }
});
exports.verifyAccessToken = verifyAccessToken;
//# sourceMappingURL=tokenverification.middleware.js.map