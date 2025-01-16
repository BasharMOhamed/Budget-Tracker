import { CurrencyComboBox } from "@/Components/CurrencyComboBox";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Recycle, SquarePlus, TrendingDown, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Manage",
  description: "A website which make you able to track your budget",
};
function ManagePage() {
  return (
    <div className="flex flex-col items-center gap-5">
      <header className="w-full px-8 py-10 border-b-2 bg-card">
        <h1 className="text-4xl text-bold">Manage</h1>
        <h3 className="text-muted-foreground">
          Manage your account settings and categories
        </h3>
      </header>
      <CurrencyManagementComponent />
      <CategoryManagement type="income" />
      <CategoryManagement type="expense" />
    </div>
  );
}

function CurrencyManagementComponent() {
  return (
    <Card className="w-4/5">
      <CardHeader>
        <CardTitle>Currency</CardTitle>
        <CardDescription>
          Set your default currency for transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CurrencyComboBox />
      </CardContent>
    </Card>
  );
}

export default ManagePage;

function CategoryCard({ icon, title }) {
  return (
    <Card className="w-full sm:w-[32%] md:w-[24.7%]">
      <div className="py-4 flex flex-col items-center">
        <div className="flex flex-col justify-center items-center">
          <span className="text-4xl">{icon}</span>
          <span>{title}</span>
        </div>
      </div>
      <Button className="w-full">
        <Recycle />
        Remove
      </Button>
    </Card>
  );
}

function CategoryManagement({ type }) {
  return (
    <Card className="w-4/5">
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
          <Button>
            <SquarePlus />
            Create Category
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <div className="flex flex-wrap gap-1">
          <CategoryCard icon="🛒" title="Shopping" />
          <CategoryCard icon="🛒" title="Shopping" />
          <CategoryCard icon="🛒" title="Shopping" />
          <CategoryCard icon="🛒" title="Shopping" />
          <CategoryCard icon="🛒" title="Shopping" />
          <CategoryCard icon="🛒" title="Shopping" />
        </div>
      </CardContent>
    </Card>
  );
}
