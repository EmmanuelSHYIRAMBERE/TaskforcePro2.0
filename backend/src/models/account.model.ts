import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model.ts";

export interface IAccount extends Document {
  user: IUser["_id"];
  name: string;
  type: "BANK" | "MOBILE_MONEY" | "CASH";
  balance: number;
  currency: string;
}

const AccountSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["BANK", "MOBILE_MONEY", "CASH"],
      required: true,
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
  },
  { timestamps: true }
);

export const Account = mongoose.model<IAccount>("Account", AccountSchema);
