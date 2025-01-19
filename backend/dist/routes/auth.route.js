"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const authRouter = express_1.default.Router();
const authService = new auth_service_1.default();
const authController = new auth_controller_1.default(authService);
// In your routes file
authRouter.post("/login", authController.logIn);
authRouter.post("/change-password", authController.changePassword);
exports.default = authRouter;
//# sourceMappingURL=auth.route.js.map