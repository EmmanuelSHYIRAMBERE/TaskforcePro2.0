import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Account } from "@/types/account";
import { AlertTriangle } from "lucide-react";

interface DeleteAccountDialogProps {
  account: Account | null;
  onClose: () => void;
  onConfirm: (accountId: string) => void;
}

export const DeleteAccountDialog = ({
  account,
  onClose,
  onConfirm,
}: DeleteAccountDialogProps) => {
  if (!account) return null;

  const handleConfirm = () => {
    if (account.balance > 0) {
      return;
    }
    onConfirm(account._id);
  };

  return (
    <Dialog open={!!account} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The account will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm">
            <p className="font-medium">Account Details:</p>
            <p>Name: {account.name}</p>
            <p>Type: {account.type.toLowerCase().replace("_", " ")}</p>
            <p>
              Current Balance: {account.currency}{" "}
              {account.balance.toLocaleString()}
            </p>
          </div>

          {account.balance > 0 && (
            <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm">
              This account has a non-zero balance. Please transfer or withdraw
              all funds before deleting.
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={account.balance > 0}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
