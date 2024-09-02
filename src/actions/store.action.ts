"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prismadb";
import { authOptions } from "@/lib/auth/utils";

export const getStore = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user.email) {
    throw new Error("User not found");
  }

  const store = await prisma.store.findFirst({
    where: {
      id: session.user.storeId,
    },
    include: {
      products: true,
      categories: true,
    },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  return store;
};
