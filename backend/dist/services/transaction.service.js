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
exports.TransactionService = void 0;
const account_model_1 = require("../models/account.model");
const budget_model_1 = require("../models/budget.model");
const transaction_model_1 = require("../models/transaction.model");
const notification_service_1 = require("./notification.service");
class TransactionService {
    static createTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield transaction_model_1.Transaction.startSession();
            session.startTransaction();
            try {
                const transaction = new transaction_model_1.Transaction(data);
                yield transaction.save({ session });
                // Update account balance
                const account = yield account_model_1.Account.findById(data.account);
                if (!account)
                    throw new Error("Account not found");
                if (data.amount === undefined) {
                    throw new Error("Transaction amount is required");
                }
                const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;
                account.balance += balanceChange;
                yield account.save({ session });
                // Update budget if it exists
                if (data.type === "EXPENSE") {
                    const budget = yield budget_model_1.Budget.findOne({
                        category: data.category,
                        startDate: { $lte: data.date },
                        endDate: { $gte: data.date },
                    });
                    if (budget) {
                        budget.spent += data.amount;
                        yield budget.save({ session });
                        // Check if budget exceeded
                        if (budget.spent > budget.amount && budget.notifications) {
                            yield notification_service_1.NotificationService.sendBudgetAlert(budget);
                        }
                    }
                }
                yield session.commitTransaction();
                return transaction;
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    static getTransactions(userId, filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = Object.assign({ user: userId }, filters);
            return transaction_model_1.Transaction.find(query)
                .populate("account")
                .populate("category")
                .sort({ date: -1 });
        });
    }
    static getTransactionsSummary(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return transaction_model_1.Transaction.aggregate([
                {
                    $match: {
                        user: userId,
                        date: { $gte: startDate, $lte: endDate },
                    },
                },
                {
                    $group: {
                        _id: {
                            type: "$type",
                            category: "$category",
                        },
                        total: { $sum: "$amount" },
                    },
                },
            ]);
        });
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map