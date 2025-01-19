import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model.ts";

export interface INotification extends Document {
  user: IUser["_id"];
  type:
    | "BUDGET_ALERT"
    | "BUDGET_WARNING"
    | "BUDGET_EXCEEDED"
    | "SYSTEM"
    | "INFO";
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["BUDGET_ALERT", "BUDGET_WARNING", "BUDGET_EXCEEDED"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Index for efficient querying of user's notifications
NotificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
