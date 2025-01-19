import express from "express";
import { ExpenseController } from "../controllers/expense.controller";
import { verifyAccessToken } from "../middlewares/tokenverification.middleware";

const expenseRouter = express.Router();
const expenseController = new ExpenseController();

expenseRouter.use(verifyAccessToken);

expenseRouter
  .route("/")
  .post(expenseController.createExpense)
  .get(expenseController.getExpenses);

expenseRouter.get(
  "/category/:categoryId",
  expenseController.getExpensesByCategory
);

expenseRouter
  .route("/:id")
  .get(expenseController.getExpenseById)
  .patch(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

export default expenseRouter;
