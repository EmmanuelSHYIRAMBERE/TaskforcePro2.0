import nodemailer from "nodemailer";
import { IBudget } from "../models/budget.model";

export class NotificationService {
  private static transporter = nodemailer.createTransport({
    // Configure your email service here
  });

  static async sendBudgetAlert(budget: IBudget) {
    const exceededAmount = budget.spent - budget.amount;
    const message = {
      to: "user@example.com", // Get from user profile
      subject: "Budget Alert",
      text: `Your budget for ${budget.category} has been exceeded by ${exceededAmount}`,
    };

    await this.transporter.sendMail(message);
  }
}
