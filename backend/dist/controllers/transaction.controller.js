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
exports.TransactionController = void 0;
const transaction_model_1 = require("../models/transaction.model");
const account_model_1 = require("../models/account.model");
const budget_model_1 = require("../models/budget.model");
class TransactionController {
    // Create new transaction
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { accountId, categoryId, amount, type, description } = req.body;
                const userId = req.user._id;
                // Create transaction
                const transaction = new transaction_model_1.Transaction({
                    userId,
                    accountId,
                    categoryId,
                    amount,
                    type,
                    description,
                    date: new Date(),
                });
                // Update account balance
                const account = yield account_model_1.Account.findById(accountId);
                if (!account) {
                    return res.status(404).json({ message: "Account not found" });
                }
                account.balance += type === "income" ? amount : -amount;
                yield account.save();
                yield transaction.save();
                // Check budget alerts
                if (type === "expense") {
                    const budget = yield budget_model_1.Budget.findOne({
                        userId,
                        categoryId,
                        startDate: { $lte: new Date() },
                        endDate: { $gte: new Date() },
                    });
                    if (budget) {
                        const totalExpenses = yield transaction_model_1.Transaction.aggregate([
                            {
                                $match: {
                                    userId,
                                    categoryId,
                                    type: "expense",
                                    date: { $gte: budget.startDate, $lte: budget.endDate },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    total: { $sum: "$amount" },
                                },
                            },
                        ]);
                        if (((_a = totalExpenses[0]) === null || _a === void 0 ? void 0 : _a.total) > budget.amount) {
                            // In a real application, you would implement notification logic here
                            console.log("Budget exceeded for category:", categoryId);
                        }
                    }
                }
                res.status(201).json(transaction);
            }
            catch (error) {
                res.status(500).json({ message: "Error creating transaction", error });
            }
        });
    }
    // Get transactions with filtering and pagination
    static getTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, accountId, categoryId, type, page = 1, limit = 10, } = req.query;
                const userId = req.user._id;
                const query = { userId };
                if (startDate && endDate) {
                    query.date = {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    };
                }
                if (accountId)
                    query.accountId = accountId;
                if (categoryId)
                    query.categoryId = categoryId;
                if (type)
                    query.type = type;
                const transactions = yield transaction_model_1.Transaction.find(query)
                    .sort({ date: -1 })
                    .skip((Number(page) - 1) * Number(limit))
                    .limit(Number(limit))
                    .populate("categoryId")
                    .populate("accountId");
                const total = yield transaction_model_1.Transaction.countDocuments(query);
                res.json({
                    transactions,
                    total,
                    pages: Math.ceil(total / Number(limit)),
                });
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching transactions", error });
            }
        });
    }
    // Get transaction summary
    static getSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const userId = req.user._id;
                const summary = yield transaction_model_1.Transaction.aggregate([
                    {
                        $match: {
                            userId,
                            date: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                type: "$type",
                                category: "$categoryId",
                            },
                            total: { $sum: "$amount" },
                        },
                    },
                ]);
                res.json(summary);
            }
            catch (error) {
                res.status(500).json({ message: "Error getting summary", error });
            }
        });
    }
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map