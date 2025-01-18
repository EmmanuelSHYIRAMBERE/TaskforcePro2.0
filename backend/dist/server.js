"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_config_1 = __importDefault(require("./config/db.config"));
const routes_1 = __importDefault(require("./routes"));
const logger_utils_1 = __importDefault(require("./utils/logger.utils"));
// expose static files
const swaggerDocument = yamljs_1.default.load("./src/config/swagger.yaml");
function configureApp() {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: ["*"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use((req, res, next) => {
        logger_utils_1.default.info(`${req.method} ${req.url}, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    }`);
        next();
    });
    // serve and swagger documentation
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    app.use("/api/v1", routes_1.default);
    // Welcome route
    app.get("/", (req, res) => {
        res.status(200).send("Welcome to Personal Wallet Management System");
    });
    app.all("*", (req, res) => {
        logger_utils_1.default.warn(`Route not found: ${req.method} ${req.url}`);
        res.status(404).json({
            message: "Route not found",
        });
    });
    return app;
}
const app = configureApp();
const PORT = process.env.PORT || 8000;
const server = (0, http_1.createServer)(app);
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    logger_utils_1.default.error("Uncaught Exception", {
        error: error.message,
        stack: error.stack,
    });
    process.exit(1);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger_utils_1.default.error("Unhandled Rejection", { reason, promise });
});
(0, db_config_1.default)()
    .then(() => {
    server.listen(PORT, () => {
        logger_utils_1.default.info(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    logger_utils_1.default.error("Failed to connect to database", { error: error.message });
});
//# sourceMappingURL=server.js.map