import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Report } from "../types/reports";

interface ReportDetailsDialogProps {
  report: Report;
}

export const ReportDetailsDialog: React.FC<ReportDetailsDialogProps> = ({
  report,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>Report {format(new Date(report.generatedAt), "PP")}</span>
          <Download className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Report Details - {format(new Date(report.generatedAt), "PP")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Period</h4>
              <p>
                {format(new Date(report.startDate), "PP")} -{" "}
                {format(new Date(report.endDate), "PP")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Net Balance</h4>
              <p>${report.netBalance.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Category Breakdown</h4>
            <div className="space-y-2">
              {report.categoryBreakdown.map((category) => (
                <div
                  key={category.category._id}
                  className="flex justify-between"
                >
                  <span>{category.category.name}</span>
                  <span>
                    ${category.amount.toLocaleString()} ({category.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
