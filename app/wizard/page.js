import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
async function Wizard() {
  const user = await currentUser();
  return (
    <div className="w-4/5 container flex flex-col items-center justify-between gap-4 max-w-xl">
      <div>
        <h1 className="text-3xl text-center">
          Welcome, <span className="text-bold">{user.firstName}👋</span>
        </h1>
        <h2 className="text-center mt-4 text-base text-muted-foreground">
          Let&apos;s get started by setting up your currency
        </h2>
        <h3 className="text-center mt-2 text-sm text-muted-foreground">
          You can change these settings at any time
        </h3>
      </div>
      <Separator />
      <Card className="w-full">
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
      <Button className="w-full" asChild>
        <Link href="/">I&apos;m done! Take me to the dashboard</Link>
      </Button>
      <Logo />
    </div>
  );
}

export default Wizard;
