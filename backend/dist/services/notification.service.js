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
exports.NotificationService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class NotificationService {
    static sendBudgetAlert(budget) {
        return __awaiter(this, void 0, void 0, function* () {
            const exceededAmount = budget.spent - budget.amount;
            const message = {
                to: "user@example.com", // Get from user profile
                subject: "Budget Alert",
                text: `Your budget for ${budget.category} has been exceeded by ${exceededAmount}`,
            };
            yield this.transporter.sendMail(message);
        });
    }
}
exports.NotificationService = NotificationService;
NotificationService.transporter = nodemailer_1.default.createTransport({
// Configure your email service here
});
//# sourceMappingURL=notification.service.js.map