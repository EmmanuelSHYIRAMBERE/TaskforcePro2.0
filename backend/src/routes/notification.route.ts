import express from "express";
import { NotificationController } from "../controllers/notification.controller";
import { verifyAccessToken } from "../middlewares/tokenverification.middleware";

const notificationRouter = express.Router();
const notificationController = new NotificationController();

notificationRouter.use(verifyAccessToken);

notificationRouter.get("/", notificationController.getNotifications);
notificationRouter.get("/unread", notificationController.getUnreadCount);
notificationRouter.post("/mark-all-read", notificationController.markAllAsRead);
notificationRouter.delete(
  "/clear-all",
  notificationController.clearAllNotifications
);

notificationRouter
  .route("/:id")
  .post(notificationController.markAsRead)
  .delete(notificationController.deleteNotification);

export default notificationRouter;
