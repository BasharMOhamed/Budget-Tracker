import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import Overview from "@/components/Overview";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Dashboard",
  description: "A website which make you able to track your budget",
};
async function Dashboard() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    redirect("/wizard");
  }
  return (
    <div className="">
      <header className="w-full flex flex-wrap gap-3 justify-between px-8 py-10 border-b-2 bg-card">
        <h1 className="text-3xl text-bold">Hello, {user.firstName}! 👋</h1>
        <div className="flex gap-2">
          <CreateTransactionDialog
            trigger={
              <Button
                variant="outline"
                className="border-emerald-500 text-white bg-emerald-950 hover:bg-emerald-700 "
              >
                New income 🤑
              </Button>
            }
            type={"income"}
          />
          <CreateTransactionDialog
            trigger={
              <Button
                variant="outline"
                className="border-rose-500 text-white bg-rose-950 hover:bg-rose-700"
              >
                New expense 😤
              </Button>
            }
            type={"expense"}
          />
        </div>
      </header>
      <Overview userSettings={userSettings} />
    </div>
  );
}

export default Dashboard;
