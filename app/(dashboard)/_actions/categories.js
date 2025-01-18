"use server";

import prisma from "@/lib/prisma";
import { CategorySchema } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form) {
  const parsedBody = CategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("Bad Request");
  }
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { name, icon, type } = parsedBody.data;
  return await prisma.category.create({
    data: {
      userId: user.id,
      name: name,
      icon: icon,
      type: type,
    },
  });
}

export async function DeleteCategory(category) {
  const parsedBody = CategorySchema.safeParse(category);
  if (!parsedBody.success) {
    throw new Error("Bad Request");
  }
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { name, icon, type } = parsedBody.data;
  return await prisma.category.delete({
    where: {
      name_userId_type: {
        name: name,
        userId: user.id,
        type: type,
      },
    },
  });
}
