import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  console.log("year: ", year);
  const result = await prisma.yearHistory.findMany({
    where: {
      userId: user.id,
      year: parseInt(year),
    },
    select: {
      month: true,
      income: true,
      expense: true,
    },
  });
  const data = result.map((his) => {
    const date = new Date(year, his.month);
    const monthName = date.toLocaleString("default", { month: "long" });
    return {
      month: monthName,
      income: his.income,
      expense: his.expense,
    };
  });
  return Response.json(data);
}
