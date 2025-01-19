import express from "express";
import { BudgetController } from "../controllers/budget.controller";
import { verifyAccessToken } from "../middlewares/tokenverification.middleware";

const budgetRouter = express.Router();
const budgetController = new BudgetController();

budgetRouter.use(verifyAccessToken);

budgetRouter
  .route("/")
  .post(budgetController.createBudget)
  .get(budgetController.getBudgets);

budgetRouter
  .route("/:id")
  .patch(budgetController.updateBudget)
  .delete(budgetController.deleteBudget);

export default budgetRouter;
