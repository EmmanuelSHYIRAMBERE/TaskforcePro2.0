import { useEffect, useState } from "react";
import axios from "axios";
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
import { Account } from "@/types/account";
import { useToast } from "@/hooks/use-toast";
import usePost from "@/hooks/use-post";
import TransferForm from "@/components/forms/transfer-form";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";

const API_BASE_URL = "/api/v1";

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const { toast } = useToast();

  const { add, isAdding } = usePost("/accounts");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      setAccounts(response.data?.data || []);
    } catch (error) {
      console.log("Error fetching accounts", error);
      toast({
        title: "Error",
        description: "Failed to load accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddAccount = async (data: Omit<Account, "_id">) => {
    try {
      const response = await add(data);

      console.log("Add account response", response);

      await fetchAccounts();
      setShowAddAccount(false);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error) {
      console.log("Error creating account", error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleEditAccount = async (data: Partial<Account>) => {
    if (!editingAccount) return;

    try {
      await axios.patch(`${API_BASE_URL}/accounts/${editingAccount._id}`, data);
      await fetchAccounts();
      setEditingAccount(null);
      toast({
        title: "Success",
        description: "Account updated successfully",
      });
    } catch (error) {
      console.log("Error updating account", error);
      toast({
        title: "Error",
        description: "Failed to update account",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/accounts/${accountId}`);
      await fetchAccounts();
      setDeletingAccount(null);
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
    } catch (error) {
      console.log("Error deleting account", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = async (data: {
    fromAccount: string;
    toAccount: string;
    amount: number;
    description?: string;
  }) => {
    try {
      await axios.post(`${API_BASE_URL}/transfers`, data);
      await fetchAccounts();
      setShowTransfer(false);
      toast({
        title: "Success",
        description: "Transfer completed successfully",
      });
    } catch (error) {
      console.log("Error transferring funds", error);
      toast({
        title: "Error",
        description: "Failed to complete transfer",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading accounts...</div>;
  }

  if (!accounts) {
    return <div>No accounts available.</div>;
  }

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {Array.isArray(accounts)
                ? accounts
                    .reduce((sum, acc) => sum + (acc.balance || 0), 0)
                    .toLocaleString()
                : "0"}
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
            <div className="text-2xl font-bold">
              {Array.isArray(accounts)
                ? accounts.filter((acc) => acc.isActive).length
                : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.length > 0
                ? new Date(
                    Math.max(
                      ...accounts
                        .filter((a) => a.updatedAt)
                        .map((a) => new Date(a.updatedAt).getTime())
                    )
                  ).toLocaleDateString()
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account._id}>
                  <TableCell className="font-medium">
                    {account.name || "N/A"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {account.type
                      ? account.type.toLowerCase().replace("_", " ")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {(account.balance || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{account.currency || "N/A"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        account.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {account.isActive ? "Active" : "Inactive"}
                    </span>
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

      <AccountForm
        open={showAddAccount || !!editingAccount}
        onClose={() => {
          setShowAddAccount(false);
          setEditingAccount(null);
        }}
        onSubmit={(data: Partial<Account>) => {
          if (editingAccount) {
            handleEditAccount(data);
          } else {
            handleAddAccount(data as Omit<Account, "_id">);
          }
        }}
        isLoading={isAdding}
        account={editingAccount}
      />

      <TransferForm
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        onSubmit={handleTransfer}
        accounts={accounts || []}
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
