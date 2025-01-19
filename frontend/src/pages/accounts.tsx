import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, ArrowLeftRight } from "lucide-react";
import { AccountForm } from "@/components/forms/account-form";
import { Account, Transfer } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import TransferForm from "@/components/forms/transfer-form";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { AccountSchema } from "@/components/forms/schemas";

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      name: "Main Bank Account",
      type: "bank",
      balance: 5000,
      currency: "USD",
      lastUpdated: "2024-01-19",
      accountNumber: "****1234",
    },
  ]);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const { toast } = useToast();

  const handleAddAccount = (data: z.infer<typeof AccountSchema>) => {
    const newAccount: Account = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString(),
    };
    setAccounts([...accounts, newAccount]);
    setShowAddAccount(false);
    toast({
      title: "Account Added",
      description: "New account has been successfully created.",
    });
  };

  const handleEditAccount = (data: z.infer<typeof AccountSchema>) => {
    if (!editingAccount) return;

    const updatedAccount: Account = {
      ...editingAccount,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    setAccounts(
      accounts.map((a) => (a.id === updatedAccount.id ? updatedAccount : a))
    );
    setEditingAccount(null);
    toast({
      title: "Account Updated",
      description: "Account details have been successfully updated.",
    });
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter((a) => a.id !== accountId));
    setDeletingAccount(null);
    toast({
      title: "Account Deleted",
      description: "Account has been successfully deleted.",
    });
  };

  const handleTransfer = (data: {
    fromAccount: string;
    toAccount: string;
    amount: number;
    description?: string;
  }) => {
    const transfer: Omit<Transfer, "id"> = {
      ...data,
      date: new Date().toISOString(),
    };

    setAccounts(
      accounts.map((account) => {
        if (account.id === transfer.fromAccount) {
          return { ...account, balance: account.balance - transfer.amount };
        }
        if (account.id === transfer.toAccount) {
          return { ...account, balance: account.balance + transfer.amount };
        }
        return account;
      })
    );
    setShowTransfer(false);
    toast({
      title: "Transfer Complete",
      description: "Money has been successfully transferred.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
        <div className="space-x-2">
          <Button
            onClick={() => setShowTransfer(true)}
            variant="outline"
            className="space-x-2"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Transfer</span>
          </Button>
          <Button onClick={() => setShowAddAccount(true)} className="space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Account</span>
          </Button>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {accounts
                .reduce((sum, acc) => sum + acc.balance, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(
                Math.max(
                  ...accounts.map((a) => new Date(a.lastUpdated).getTime())
                )
              ).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell className="capitalize">
                    {account.type.replace("_", " ")}
                  </TableCell>
                  <TableCell>{account.accountNumber || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    {account.currency} {account.balance.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(account.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingAccount(account)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingAccount(account)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <AccountForm
        open={showAddAccount || !!editingAccount}
        onClose={() => {
          setShowAddAccount(false);
          setEditingAccount(null);
        }}
        onSubmit={editingAccount ? handleEditAccount : handleAddAccount}
        account={editingAccount}
      />

      <TransferForm
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        onSubmit={handleTransfer}
        accounts={accounts}
      />

      <DeleteAccountDialog
        account={deletingAccount}
        onClose={() => setDeletingAccount(null)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default Accounts;
