import { DeleteCategory } from "@/app/(dashboard)/_actions/categories";
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

export default function DeleteCategoryDialog({ trigger, category }) {
  const categoriesQuery = useQueryClient();
  const deleteMutation = useMutation({
    mutationKey: ["deleteCategory", category],
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      await categoriesQuery.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Category Deleted Successfully", {
        id: "delete-category",
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            {category.name} category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting category...", {
                id: "delete-category",
              });
              deleteMutation.mutate(category);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
