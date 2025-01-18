import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CategoryManagement from "@/components/CategoryManagement";

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
