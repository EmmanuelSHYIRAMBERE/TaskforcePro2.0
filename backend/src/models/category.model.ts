import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model.ts";

export interface ICategory extends Document {
  user: IUser["_id"];
  name: string;
  type: "EXPENSE" | "INCOME";
  parent?: ICategory["_id"];
  color?: string;
}

const CategorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["EXPENSE", "INCOME"], required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category" },
    color: { type: String },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
