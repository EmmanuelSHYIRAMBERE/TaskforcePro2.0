import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: string;
  parentId?: mongoose.Types.ObjectId;
}

const CategorySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  type: { type: String, required: true }, // income, expense
  parentId: { type: Schema.Types.ObjectId, ref: "Category" },
});

export default mongoose.model<ICategory>("Category", CategorySchema);
