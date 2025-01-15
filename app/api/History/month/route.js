import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year"));
  const month = searchParams.get("month");

  if (!year || !month) {
    return new Response("Year and month are required", { status: 400 });
  }

  // Get the last day of the month
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  // Fetch data from the database
  const result = await prisma.monthHistory.findMany({
    where: {
      userId: user.id,
      month: monthIndex,
      year: year,
    },
    select: {
      day: true,
      income: true,
      expense: true,
    },
  });

  const dataMap = new Map();
  result.forEach((entry) => {
    dataMap.set(entry.day, { income: entry.income, expense: entry.expense });
  });

  const daysArray = Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    const data = dataMap.get(day) || { income: 0, expense: 0 };
    return {
      day,
      income: data.income,
      expense: data.expense,
    };
  });

  return Response.json(daysArray);
}
