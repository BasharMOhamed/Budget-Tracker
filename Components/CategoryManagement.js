"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "./ui/card";
import { TrendingDown, TrendingUp, SquarePlus, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import SkeletonWrapper from "./SkeletonWrapper";
import CreateCategoryDialog from "./CreateCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
export default function CategoryManagement({ type }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });
  return (
    <Card className="w-4/5">
      <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
        <CardHeader>
          <div className="flex justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {type === "income" ? (
                <TrendingUp className="h-12 w-12 rounded-lg text-emerald-500 bg-emerald-400/10 p-2" />
              ) : (
                <TrendingDown className="h-12 w-12 rounded-lg text-red-500 bg-red-400/10 p-2" />
              )}
              <div className="flex flex-col gap-0">
                <h2 className="text-3xl font-bold">
                  {type === "income" ? "Income" : "Expense"} categories
                </h2>
                <p className="text-muted-foreground">Sorted by name</p>
              </div>
            </div>
            <CreateCategoryDialog
              type={type}
              trigger={
                <Button className="w-full md:w-auto">
                  <SquarePlus />
                  Create Category
                </Button>
              }
            />
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {!categoriesQuery.isLoading &&
              categoriesQuery.data.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))}
          </div>
        </CardContent>
      </SkeletonWrapper>
    </Card>
  );
}

function CategoryCard({ category }) {
  return (
    <Card className="">
      <div className="py-4 flex flex-col items-center">
        <div className="flex flex-col justify-center items-center">
          <span className="text-4xl">{category.icon}</span>
          <span>{category.title}</span>
        </div>
      </div>
      <DeleteCategoryDialog
        trigger={
          <Button className="w-full" variant="secondary">
            <Trash2 />
            Remove
          </Button>
        }
        category={category}
      />
    </Card>
  );
}
