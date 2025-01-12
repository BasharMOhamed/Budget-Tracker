"use server";
import prisma from "@/lib/prisma";
import { CreateTransactionSchema } from "@/schema/transactions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createTransaction(form) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("Bad Request");
  }
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const transaction = parsedBody.data;
  const { amount, description, date, type, category } = transaction;
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });
  if (!categoryRow) {
    throw new Error("Category Not Found!");
  }
  console.log(`date: ${date}`);

  return await prisma.$transaction([
    prisma.transaction.create({
      data: {
        amount,
        description,
        date: date.toISOString(),
        type,
        userId: user.id,
        category,
        categoryType: categoryRow.icon,
      },
    }),

    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          userId: user.id,
        },
      },
      create: {
        userId: user.id,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          month: date.getMonth(),
          year: date.getFullYear(),
          userId: user.id,
        },
      },
      create: {
        userId: user.id,
        month: date.getMonth(),
        year: date.getFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
