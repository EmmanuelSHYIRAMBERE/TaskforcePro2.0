import mongoose, { Schema, Document } from "mongoose";
import { IAccount } from "./account.model";
import { ICategory } from "./category.model";
import { IUser } from "./user.model.ts";

export interface ITransaction extends Document {
  user: IUser["_id"];
  account: IAccount["_id"];
  category: ICategory["_id"];
  subcategory?: ICategory["_id"];
  type: "EXPENSE" | "INCOME";
  amount: number;
  description: string;
  date: Date;
  tags?: string[];
  attachments?: string[];
  location?: {
    type: string;
    coordinates: number[];
  };
}

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Category" },
    type: { type: String, enum: ["EXPENSE", "INCOME"], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }],
    attachments: [{ type: String }],
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: [Number],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better query performance
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, category: 1 });
TransactionSchema.index({ user: 1, account: 1 });

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
