"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const node_1 = require("@logtail/node");
const winston_2 = require("@logtail/winston");
if (!process.env.BetterStackToken) {
    throw new Error("Wallet Web environment variable is not set");
}
const logtail = new node_1.Logtail(process.env.BetterStackToken);
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    defaultMeta: { service: "wallet-web-backend" },
    transports: [new winston_1.default.transports.Console(), new winston_2.LogtailTransport(logtail)],
});
exports.default = logger;
//# sourceMappingURL=logger.utils.js.map