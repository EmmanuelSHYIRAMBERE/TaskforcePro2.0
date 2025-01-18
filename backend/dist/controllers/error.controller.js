"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrorDB = exports.handCastError = exports.handleDuplicateFieldsDB = exports.globalErrorController = void 0;
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const errorhandler_utils_1 = __importDefault(require("../utils/errorhandler.utils"));
const globalErrorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (err.name === "CastError")
        err = (0, exports.handCastError)(err);
    if (err.name === "ValidationError")
        err = (0, exports.handleValidationErrorDB)(err);
    if (err.code === 11000)
        err = (0, exports.handleDuplicateFieldsDB)(err);
    console.log("Error occurred:", err);
    logger_utils_1.default.error(err);
    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message,
    });
};
exports.globalErrorController = globalErrorController;
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}`;
    return new errorhandler_utils_1.default({ message, statusCode: 400 });
};
exports.handleDuplicateFieldsDB = handleDuplicateFieldsDB;
const handCastError = (err) => {
    const message = `Invalid input data ${err.stringValue} because of ${err.reason}`;
    return new errorhandler_utils_1.default({ message, statusCode: 400 });
};
exports.handCastError = handCastError;
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => {
        return `Invalid input data: "${el.value}" at path "${el.path}"`;
    });
    const message = errors.join(". ").replace(/\\"/g, '"');
    return new errorhandler_utils_1.default({ message, statusCode: 400 });
};
exports.handleValidationErrorDB = handleValidationErrorDB;
//# sourceMappingURL=error.controller.js.map