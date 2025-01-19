import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model.ts";
import { ICategory } from "./category.model";

export interface IExpense extends Document {
  user: IUser["_id"];
  amount: number;
  description?: string;
  date: Date;
  category: ICategory["_id"];
  subcategory?: ICategory["_id"];
  account: string;
  tags?: string[];
  attachments?: string[];
  isRecurring: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  nextRecurringDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, required: true, default: Date.now },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Category" },
    account: { type: String, required: true },
    tags: [{ type: String }],
    attachments: [{ type: String }],
    isRecurring: { type: Boolean, default: false },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    nextRecurringDate: { type: Date },
  },
  { timestamps: true }
);

// Validate that subcategory belongs to the selected category
ExpenseSchema.pre("save", async function () {
  if (this.subcategory) {
    const subcategory = await mongoose
      .model("Category")
      .findById(this.subcategory);
    if (!subcategory || !subcategory.parent?.equals(this.category)) {
      throw new Error("Invalid subcategory for the selected category");
    }
  }
});

export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
