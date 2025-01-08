"use client";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "./ui/form";
import { Input } from "./ui/input";
import { CreateTransactionSchema } from "@/schema/transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import CategoryPicker from "./CattegoryPicker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { createTransaction } from "@/app/(dashboard)/_actions/transactions";
import { toast } from "sonner";
import { useCallback } from "react";

export default function CreateTransactionDialog({ trigger, type }) {
  const form = useForm({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const handleCategoryChange = useCallback(
    (value) => {
      form.setValue("category", value);
    },
    [form]
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["createTransaction"],
    mutation: createTransaction,
    onSuccess: (data) => {
      form.reset();
      toast.success("Transaction created successfully", {
        id: "create-transaction",
      });
    },
    onError: () => {
      toast.error("Error creating transaction", {
        id: "create-transaction",
      });
    },
  });

  const onSubmit = useCallback(
    (values) => {
      toast.loading("Creating Transaction...", {
        id: "create-transaction",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={`${
                type === "income" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {type}
            </span>{" "}
            transaction
          </DialogTitle>
          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional).
                  </FormDescription>
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
                    <Input defaultValue={0} min={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (required).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-9">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transaction.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Select a date for this.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"secondary"} onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
