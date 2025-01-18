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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const budget_model_1 = require("../models/budget.model");
const notification_service_1 = require("./notification.service");
class BudgetService {
    static createBudget(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const budget = new budget_model_1.Budget(data);
            yield budget.save();
            return budget;
        });
    }
    static getBudgets(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return budget_model_1.Budget.find({ user: userId }).populate("category");
        });
    }
    static checkBudgetStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const budgets = yield budget_model_1.Budget.find({
                user: userId,
                notifications: true,
                endDate: { $gte: new Date() },
            });
            for (const budget of budgets) {
                if (budget.spent > budget.amount) {
                    yield notification_service_1.NotificationService.sendBudgetAlert(budget);
                }
            }
        });
    }
}
exports.BudgetService = BudgetService;
//# sourceMappingURL=budget.service.js.map