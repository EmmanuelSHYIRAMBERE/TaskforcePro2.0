import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model.ts";

export interface IAccount extends Document {
  user: IUser["_id"];
  name: string;
  type: "BANK" | "MOBILE_MONEY" | "CASH" | "OTHER";
  balance: number;
  currency: string;
  description?: string;
  isActive: boolean;
  lastUpdated: Date;
}

const AccountSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["BANK", "MOBILE_MONEY", "CASH", "OTHER"],
      required: true,
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better query performance
AccountSchema.index({ user: 1, name: 1 }, { unique: true });
AccountSchema.index({ user: 1, type: 1 });

export const Account = mongoose.model<IAccount>("Account", AccountSchema);
