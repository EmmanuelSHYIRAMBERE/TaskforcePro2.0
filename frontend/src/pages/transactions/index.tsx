import AppModal from "@/components/app-modal";
import AppTable from "@/components/app-table";
import { Button } from "@/components/ui/button";

const headers = ["Date", "Description", "Amount", "Category"];
const data = [
  {
    Date: "2025-01-01",
    Description: "Groceries",
    Amount: "$50",
    Category: "Food",
  },
  {
    Date: "2025-01-02",
    Description: "Rent",
    Amount: "$1200",
    Category: "Housing",
  },
];

const Transactions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <AppModal title="Add Transaction" trigger={<Button>Add New</Button>}>
          {/* Add Form Here */}
          <p>Form to add a transaction</p>
        </AppModal>
      </div>
      <AppTable headers={headers} data={data} />
    </div>
  );
};

export default Transactions;
