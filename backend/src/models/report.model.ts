import mongoose, { Schema, Document } from "mongoose";
import { ITransaction } from "./transaction.model";
import { IUser } from "./user.model.ts";

export interface IReport extends Document {
  user: IUser["_id"];
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  accountBreakdown: Array<{
    account: string;
    balance: number;
    transactions: number;
  }>;
  transactions: ITransaction["_id"][];
  generatedAt: Date;
}

const ReportSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalIncome: { type: Number, required: true },
    totalExpense: { type: Number, required: true },
    netBalance: { type: Number, required: true },
    categoryBreakdown: [
      {
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        amount: Number,
        percentage: Number,
      },
    ],
    accountBreakdown: [
      {
        account: { type: Schema.Types.ObjectId, ref: "Account" },
        balance: Number,
        transactions: Number,
      },
    ],
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ReportSchema.index({ user: 1, startDate: 1, endDate: 1 });

export const Report = mongoose.model<IReport>("Report", ReportSchema);
