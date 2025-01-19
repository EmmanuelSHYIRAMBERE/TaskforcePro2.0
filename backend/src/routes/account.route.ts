import express from "express";
import { AccountController } from "../controllers/account.controller";
import { verifyAccessToken } from "../middlewares/tokenverification.middleware";

const accountRouter = express.Router();
const accountController = new AccountController();

accountRouter.use(verifyAccessToken);

accountRouter
  .route("/")
  .post(accountController.createAccount)
  .get(accountController.getAccounts);

accountRouter
  .route("/:id")
  .get(accountController.getAccount)
  .patch(accountController.updateAccount)
  .delete(accountController.deleteAccount);

accountRouter.get("/:id/balance", accountController.getAccountBalance);

export default accountRouter;
