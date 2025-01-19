import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model.ts";

export interface ICategory extends Document {
  user: IUser["_id"];
  name: string;
  description?: string;
  type: "EXPENSE" | "INCOME";
  parent?: mongoose.Types.ObjectId;
  color?: string;
  icon?: string;
  isActive: boolean;
  transactionCount?: number;
  totalAmount?: number;
  subcategories?: ICategory[];
}

const CategorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["EXPENSE", "INCOME"], required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category" },
    color: {
      type: String,
      default: "#000000",
      validate: {
        validator: (v: string) => /^#[0-9A-Fa-f]{6}$/.test(v),
        message: "Color must be a valid hex color code",
      },
    },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for subcategories
CategorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// Ensure unique category names per user and parent
CategorySchema.index({ user: 1, name: 1, parent: 1 }, { unique: true });

CategorySchema.pre("find", function () {
  this.populate("subcategories");
});

// Prevent circular references in subcategories
CategorySchema.pre("save", async function () {
  if (this.parent) {
    let currentParent = await this.model("Category").findById(this.parent);
    while (currentParent) {
      if (currentParent._id.equals(this._id)) {
        throw new Error("Circular reference detected in category hierarchy");
      }
      currentParent = await this.model("Category").findById(
        (currentParent as unknown as ICategory).parent
      );
    }
  }
});

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
