import { FilterQuery, Schema } from "mongoose";
import { Notification, INotification } from "../models/notification.model";

export class NotificationService {
  static async sendBudgetAlert(data: {
    userId: string;
    budgetId: Schema.Types.ObjectId;
    category: Schema.Types.ObjectId;
    overspentAmount: number;
  }): Promise<INotification> {
    return this.sendNotification({
      userId: new Schema.Types.ObjectId(data.userId),
      type: "BUDGET_ALERT",
      title: "Budget Limit Exceeded",
      message: `You have exceeded your budget by ${data.overspentAmount.toFixed(
        2
      )}`,
      data: {
        budgetId: data.budgetId,
        category: data.category,
        overspentAmount: data.overspentAmount,
      },
    });
  }

  static async sendNotification(data: {
    userId: Schema.Types.ObjectId;
    type: INotification["type"];
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<INotification> {
    return Notification.create({
      user: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data,
    });
  }

  static async getNotifications(
    userId: string,
    filters: FilterQuery<INotification> = {}
  ) {
    return Notification.find({ user: userId, ...filters })
      .sort({ createdAt: -1 })
      .limit(100); // Limit to prevent overwhelming response
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ user: userId, isRead: false });
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new Error("Notification not found");
    }
    return notification;
  }

  static async markAllAsRead(userId: string) {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
  }

  static async deleteNotification(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      throw new Error("Notification not found");
    }
    return notification;
  }

  static async clearAllNotifications(userId: string) {
    await Notification.deleteMany({ user: userId });
  }
}
