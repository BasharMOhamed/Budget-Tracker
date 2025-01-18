import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }
  const years = await prisma.yearHistory.findMany({
    where: {
      userId: user.id,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "desc",
    },
  });

  return Response.json(years.map((y) => y.year));
}
