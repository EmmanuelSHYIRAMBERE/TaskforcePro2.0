"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorhandler_utils_1 = __importDefault(require("../utils/errorhandler.utils"));
const error_controller_1 = require("../controllers/error.controller");
const user_route_1 = __importDefault(require("./user.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const mainRouter = express_1.default.Router();
mainRouter.use("/user", user_route_1.default);
mainRouter.use("/auth", auth_route_1.default);
mainRouter.all("*", (req, res, next) => {
    next(new errorhandler_utils_1.default({
        message: `Failure connecting to the server!`,
        statusCode: 404,
    }));
});
mainRouter.use(error_controller_1.globalErrorController);
exports.default = mainRouter;
//# sourceMappingURL=index.js.map