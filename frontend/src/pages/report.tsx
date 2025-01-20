import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, TrendingUp, PieChart } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { Report } from "../types/reports";
import { useToast } from "@/hooks/use-toast";
import { ReportChart } from "@/components/report-chart";
import { SummaryCard } from "@/components/summary-card";
import { ReportDetailsDialog } from "@/components/report-details-dialog";

interface DateRange {
  from: Date;
  to: Date | undefined;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentRange, setCurrentRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/reports");
      const data = await response.json();
      setReports(data.data);
    } catch (error) {
      console.error("Error fetching reports", error);
      toast({
        title: "Error fetching reports",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (dateRange: DateRange) => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to?.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        await fetchReports();
        toast({
          title: "Report generated successfully",
          variant: "default",
        });
      } else {
        throw new Error("Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report", error);
      toast({
        title: "Error generating report",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeUpdate = ({ range }: { range: DateRange }) => {
    setCurrentRange(range);
    handleGenerateReport(range);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const latestReport = reports[0];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <div className="flex gap-4">
          <DateRangePicker
            initialDateFrom={currentRange.from}
            initialDateTo={currentRange.to}
            onUpdate={handleDateRangeUpdate}
            align="end"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Income"
          value={latestReport?.totalIncome || 0}
          icon={BadgeDollarSign}
        />
        <SummaryCard
          title="Total Expenses"
          value={latestReport?.totalExpense || 0}
          icon={TrendingUp}
        />
        <SummaryCard
          title="Net Balance"
          value={latestReport?.netBalance || 0}
          icon={PieChart}
        />
      </div>

      {latestReport && <ReportChart data={latestReport.categoryBreakdown} />}

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <ReportDetailsDialog key={report._id} report={report} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
