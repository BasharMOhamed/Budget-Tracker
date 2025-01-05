import { currentUser } from "@clerk/nextjs/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
const prisma = new PrismaClient();
export async function GET(request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "USD",
      },
    });
  }
  return new Response(JSON.stringify(userSettings), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
