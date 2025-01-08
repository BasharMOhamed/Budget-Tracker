"use client";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { createCategorySchema } from "@/schema/categories";
import { CircleOff, Loader2, SquarePlus } from "lucide-react";
import { PopoverTrigger, Popover, PopoverContent } from "./ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useMutation } from "@tanstack/react-query";
import { CreateCategory } from "@/app/(dashboard)/_actions/categories";
import { toast } from "sonner";
import { useCallback } from "react";
import { useTheme } from "next-themes";
export default function CreateCategoryDialog({ type }) {
  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      type,
    },
  });

  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: CreateCategory,
    onSuccess: (data) => {
      form.reset({
        type,
        name: "",
        icon: "",
      });
      toast.success(`Category ${data.name} created successfully`, {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (values) => {
      toast.loading("Creating category...", {
        id: "create-category",
      });
      console.log(values);
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent justify-start text-muted-foreground"
        >
          <SquarePlus />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={`${
                type === "income" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name of the category"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-[100px]">
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-muted-foreground text-xs">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <CircleOff className="!h-[48px] !w-[48px]" />
                              <p className="text-muted-foreground text-xs">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji) =>
                            field.onChange(emoji.native)
                          }
                          theme={theme.resolvedTheme}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how you category will appear in the app.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"} onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
