import { Account } from "@/types";
import { CreditCard } from "lucide-react";

export const AccountsOverview = ({ accounts }: { accounts: Account[] }) => {
  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <CreditCard />
            </div>
            <div>
              <p className="text-sm font-medium">{account.name}</p>
              <p className="text-xs text-muted-foreground">{account.type}</p>
            </div>
          </div>
          <div className="text-sm font-medium">
            {account.currency} {account.balance.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
