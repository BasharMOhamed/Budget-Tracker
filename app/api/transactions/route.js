import { getFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request) {
  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const parsedDate = OverviewQuerySchema.safeParse({ from, to });
  if (!parsedDate.success) {
    return Response.json(parsedDate.error.message, {
      status: 400,
    });
  }
  const data = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: parsedDate.data.from,
        lte: parsedDate.data.to,
      },
    },
  });
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  // const formatter = getFormatterForCurrency(userSettings.currency);
  const result = data.map((transaction) => {
    return {
      ...transaction,
      date: format(transaction.date, "dd/MM/yyyy"),
    };
  });
  return Response.json(result);
}
