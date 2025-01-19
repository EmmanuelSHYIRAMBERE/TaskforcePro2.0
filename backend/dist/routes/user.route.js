"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const adminverification_middleware_1 = require("../middlewares/adminverification.middleware");
const tokenverification_middleware_1 = require("../middlewares/tokenverification.middleware");
const userRouter = express_1.default.Router();
const userControllerInstance = new user_controller_1.userController();
userRouter.post("/", userControllerInstance.createUser);
userRouter.use(tokenverification_middleware_1.refreshAccessToken);
userRouter.get("/", tokenverification_middleware_1.verifyAccessToken, adminverification_middleware_1.adminauthorization, userControllerInstance.getUsers);
userRouter.get("/:id", tokenverification_middleware_1.verifyAccessToken, userControllerInstance.getUserById);
userRouter.put("/:id", tokenverification_middleware_1.verifyAccessToken, userControllerInstance.updateUser);
userRouter.delete("/:id", tokenverification_middleware_1.verifyAccessToken, userControllerInstance.deleteUser);
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map