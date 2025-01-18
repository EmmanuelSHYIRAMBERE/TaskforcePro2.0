import LineChartComponent from "@/components/line-chart-component";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const mockData = [
  { date: "Jan", value: 400 },
  { date: "Feb", value: 300 },
  { date: "Mar", value: 700 },
];

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="btn">
          Select Time Range
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Last Week</DropdownMenuItem>
          <DropdownMenuItem>Last Month</DropdownMenuItem>
          <DropdownMenuItem>Last Year</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LineChartComponent data={mockData} />
    </div>
  );
};

export default Reports;
