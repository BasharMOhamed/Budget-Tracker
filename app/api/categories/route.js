import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
export async function GET(request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");
  const validator = z.enum(["income", "expense"]);
  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return new Response("Invalid type", { status: 400 });
  }
  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      type: type,
    },
    orderBy: {
      name: "asc",
    },
  });
  return new Response(JSON.stringify(categories), {
    status: 201,
  });
}
