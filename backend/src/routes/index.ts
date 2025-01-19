import express, { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/errorhandler.utils";
import { globalErrorController } from "../controllers/error.controller";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import transactionRouter from "./transactions.route";
import { refreshAccessToken } from "../middlewares/tokenverification.middleware";
import reportRouter from "./report.route";
import budgetRouter from "./budget.route";
import categoryRouter from "./category.route";
import expenseRouter from "./expense.route";
import notificationRouter from "./notification.route";

const mainRouter = express.Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/auth", authRouter);

mainRouter.use(refreshAccessToken);

mainRouter.use("/transactions", transactionRouter);
mainRouter.use("/reports", reportRouter);
mainRouter.use("/budgets", budgetRouter);
mainRouter.use("/categories", categoryRouter);
mainRouter.use("/expenses", expenseRouter);
mainRouter.use("/notifications", notificationRouter);

mainRouter.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new errorHandler({
      message: `Failure connecting to the server!`,
      statusCode: 404,
    })
  );
});

mainRouter.use(globalErrorController);

export default mainRouter;
