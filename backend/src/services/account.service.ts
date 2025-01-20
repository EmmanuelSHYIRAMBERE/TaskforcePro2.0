import { FilterQuery } from "mongoose";
import { Account, IAccount } from "../models/account.model";
import { Transaction } from "../models/transaction.model";

export class AccountService {
  static async createAccount(data: Partial<IAccount>): Promise<IAccount> {
    // Check for duplicate account names for the same user
    const existingAccount = await Account.findOne({
      user: data.user,
      name: data.name,
    });

    if (existingAccount) {
      throw new Error("An account with this name already exists");
    }

    return Account.create(data);
  }

  static async getAccounts(userId: string) {
    return Account.find({ user: userId }).sort({ name: 1 });
  }

  static async getAccountById(accountId: string, userId: string) {
    const account = await Account.findOne({
      _id: accountId,
      user: userId,
    });

    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }

  static async updateAccount(
    accountId: string,
    userId: string,
    updates: Partial<IAccount>
  ) {
    // Prevent duplicate names
    if (updates.name) {
      const existingAccount = await Account.findOne({
        user: userId,
        name: updates.name,
        _id: { $ne: accountId },
      });

      if (existingAccount) {
        throw new Error("An account with this name already exists");
      }
    }

    const account = await Account.findOneAndUpdate(
      { _id: accountId, user: userId },
      { ...updates, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }

  static async deleteAccount(accountId: string, userId: string) {
    // Check if account has any transactions
    const hasTransactions = await Transaction.exists({
      account: accountId,
      user: userId,
    });

    if (hasTransactions) {
      // Soft delete by marking as inactive
      return this.updateAccount(accountId, userId, { isActive: false });
    }

    // Hard delete if no transactions exist
    const account = await Account.findOneAndDelete({
      _id: accountId,
      user: userId,
    });

    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }

  static async getAccountBalance(accountId: string, userId: string) {
    const account = await this.getAccountById(accountId, userId);

    const transactions = await Transaction.aggregate([
      {
        $match: {
          account: account._id,
          user: account.user,
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const balance = transactions.length
      ? transactions[0].totalIncome - transactions[0].totalExpenses
      : 0;

    return {
      account,
      balance,
      transactions: {
        totalIncome: transactions.length ? transactions[0].totalIncome : 0,
        totalExpenses: transactions.length ? transactions[0].totalExpenses : 0,
      },
    };
  }
}
