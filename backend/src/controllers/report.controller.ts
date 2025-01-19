import { NextFunction, Request, Response } from "express";
import { ReportService } from "../services/report.service";
import { catchAsyncError } from "../utils/errorhandler.utils";

export class ReportController {
  generateReport = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { startDate, endDate } = req.body;
      const report = await ReportService.generateReport(
        req.user!._id.toString(),
        new Date(startDate),
        new Date(endDate)
      );

      res.status(201).json({
        status: "success",
        data: report,
      });
    }
  );

  getReports = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const reports = await ReportService.getReports(
        req.user!._id.toString(),
        req.query
      );

      res.status(200).json({
        status: "success",
        results: reports.length,
        data: reports,
      });
    }
  );

  // getReportById = catchAsyncError(
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const report = await ReportService.getReportById(
  //       req.params.id,
  //       req.user!._id.toString()
  //     );

  //     if (!report) {
  //       return res.status(404).json({
  //         status: "fail",
  //         message: "Report not found",
  //       });
  //     }

  //     res.status(200).json({
  //       status: "success",
  //       data: report,
  //     });
  //   }
  // );
}
