import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const queryParams = OverviewQuerySchema.safeParse({ to, from });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message);
  }

  //   const stats = await getBalanceStats(
  //     user.id,
  //     queryParams.data.from,
  //     queryParams.data.to
  //   );

  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId: user.id,
      date: { gte: queryParams.data.from, lte: queryParams.data.to },
    },
    _sum: {
      amount: true,
    },
  });

  const stats = {
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
  };
  return Response.json(stats);
}
