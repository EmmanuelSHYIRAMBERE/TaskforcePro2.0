import express from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { verifyAccessToken } from "../middlewares/tokenverification.middleware";

const transactionRouter = express.Router();
const transactionController = new TransactionController();

transactionRouter
  .route("/")
  .post(verifyAccessToken, transactionController.createTransaction)
  .get(verifyAccessToken, transactionController.getTransactions);

transactionRouter.get(
  "/report",
  verifyAccessToken,
  transactionController.generateReport
);

transactionRouter.get(
  "/by-category",
  verifyAccessToken,
  transactionController.getTransactionsByCategory
);

export default transactionRouter;
