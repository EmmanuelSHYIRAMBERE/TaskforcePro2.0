import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account } from "@/types/account";
import { useState } from "react";

const transferSchema = z
  .object({
    fromAccount: z.string().min(1, "Source account is required"),
    toAccount: z.string().min(1, "Destination account is required"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    description: z.string().optional(),
  })
  .refine((data) => data.fromAccount !== data.toAccount, {
    message: "Source and destination accounts must be different",
    path: ["toAccount"],
  });

interface TransferFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof transferSchema>) => void;
  accounts: Account[];
}

const TransferForm = ({
  open,
  onClose,
  onSubmit,
  accounts,
}: TransferFormProps) => {
  const [selectedFromAccount, setSelectedFromAccount] =
    useState<Account | null>(null);

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccount: "",
      toAccount: "",
      amount: 0,
      description: "",
    },
  });

  const handleFromAccountChange = (accountId: string) => {
    const account = accounts.find((acc) => acc._id === accountId);
    setSelectedFromAccount(account || null);
    form.setValue("fromAccount", accountId);
  };

  const onSubmitForm = (data: z.infer<typeof transferSchema>) => {
    if (
      selectedFromAccount &&
      Number(data.amount) > selectedFromAccount.balance
    ) {
      form.setError("amount", {
        type: "manual",
        message: "Insufficient funds in source account",
      });
      return;
    }
    onSubmit({
      ...data,
      amount: Number(data.amount),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="fromAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Account</FormLabel>
                  <Select
                    onValueChange={handleFromAccountChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts
                        .filter((account) => account.isActive)
                        .map((account) => (
                          <SelectItem key={account._id} value={account._id}>
                            {account.name} ({account.currency}{" "}
                            {account.balance.toLocaleString()})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts
                        .filter(
                          (account) =>
                            account.isActive &&
                            account._id !== form.getValues("fromAccount")
                        )
                        .map((account) => (
                          <SelectItem key={account._id} value={account._id}>
                            {account.name} ({account.currency})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  {selectedFromAccount && (
                    <div className="text-sm text-gray-500">
                      Available balance: {selectedFromAccount.currency}{" "}
                      {selectedFromAccount.balance.toLocaleString()}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Transfer</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferForm;
