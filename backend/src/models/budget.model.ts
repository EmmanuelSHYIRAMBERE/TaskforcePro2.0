import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model.ts";
import { ICategory } from "./category.model";

export interface IBudget extends Document {
  user: IUser["_id"];
  category: ICategory["_id"];
  amount: number;
  spent: number;
  period: "MONTHLY" | "WEEKLY" | "YEARLY";
  startDate: Date;
  endDate: Date;
  notifications: boolean;
}

const BudgetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    amount: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    period: {
      type: String,
      enum: ["MONTHLY", "WEEKLY", "YEARLY"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    notifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Budget = mongoose.model<IBudget>("Budget", BudgetSchema);
