import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Account } from "@/types";

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

  return (
    <Dialog open={!!account} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete the account "{account.name}"? This
          action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(account.id)}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
