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
  const { from, to } = OverviewQuerySchema.parse({
    from: searchParams.get("from"),
    to: searchParams.get("to"),
  });
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryType"],
    where: {
      userId: user.id,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return Response.json(stats);
}
