import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { catchAsyncError } from "../utils/errorhandler.utils";

export class NotificationController {
  getNotifications = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const notifications = await NotificationService.getNotifications(
        req.user!._id.toString(),
        req.query
      );

      res.status(200).json({
        status: "success",
        results: notifications.length,
        data: notifications,
      });
    }
  );

  getUnreadCount = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const count = await NotificationService.getUnreadCount(
        req.user!._id.toString()
      );

      res.status(200).json({
        status: "success",
        data: { count },
      });
    }
  );

  markAsRead = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const notification = await NotificationService.markAsRead(
        req.params.id,
        req.user!._id.toString()
      );

      res.status(200).json({
        status: "success",
        data: notification,
      });
    }
  );

  markAllAsRead = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      await NotificationService.markAllAsRead(req.user!._id.toString());

      res.status(200).json({
        status: "success",
        data: null,
      });
    }
  );

  deleteNotification = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      await NotificationService.deleteNotification(
        req.params.id,
        req.user!._id.toString()
      );

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );

  clearAllNotifications = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      await NotificationService.clearAllNotifications(req.user!._id.toString());

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );
}
