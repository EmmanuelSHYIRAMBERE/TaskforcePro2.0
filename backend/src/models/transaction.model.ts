import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model.ts";
import { IAccount } from "./account.model";
import { ICategory } from "./category.model";

export interface ITransaction extends Document {
  user: IUser["_id"];
  account: IAccount["_id"];
  category: ICategory["_id"];
  type: "EXPENSE" | "INCOME";
  amount: number;
  description: string;
  date: Date;
}

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    type: { type: String, enum: ["EXPENSE", "INCOME"], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
