"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncError = void 0;
class errorHandler extends Error {
    constructor({ message, statusCode }) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = errorHandler;
const catchAsyncError = (asyncFunction) => {
    return (req, res, next) => {
        asyncFunction(req, res, next).catch(next);
    };
};
exports.catchAsyncError = catchAsyncError;
//# sourceMappingURL=errorhandler.utils.js.map