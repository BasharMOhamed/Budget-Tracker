import { DeleteCategory } from "@/app/(dashboard)/_actions/categories";
import { DeleteTransaction } from "@/app/(dashboard)/_actions/transactions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DeleteTransactionDialog({
  open,
  setOpen,
  transactionId,
}) {
  const categoriesQuery = useQueryClient();
  const deleteMutation = useMutation({
    mutationKey: ["deleteTransaction", transactionId],
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
      await categoriesQuery.invalidateQueries({
        queryKey: ["Transactions"],
      });
      await categoriesQuery.invalidateQueries({ queryKey: ["yearHistory"] });
      await categoriesQuery.invalidateQueries({ queryKey: ["monthHistory"] });
      toast.success("Transaction Deleted Successfully", {
        id: transactionId,
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting category...", {
                id: transactionId,
              });
              deleteMutation.mutate(transactionId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
