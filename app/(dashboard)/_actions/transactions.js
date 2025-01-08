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
  const { amount, description, date, type } = transaction;
  return await prisma.transaction.create({
    where: {
      amount,
      description,
      date,
      type,
      userId: user.id,
    },
  });
}
