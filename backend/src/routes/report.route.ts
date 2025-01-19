import express from "express";
import { ReportController } from "../controllers/report.controller";
import { verifyAccessToken } from "../middlewares/tokenverification.middleware";

const reportRouter = express.Router();
const reportController = new ReportController();

reportRouter.use(verifyAccessToken);

reportRouter
  .route("/")
  .post(reportController.generateReport)
  .get(reportController.getReports);

// reportRouter.get("/:id", reportController.getReportById);

export default reportRouter;
