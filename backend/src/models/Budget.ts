import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {}

const BudgetSchema: Schema = new Schema({});

export default mongoose.model<IBudget>("Budget", BudgetSchema);
