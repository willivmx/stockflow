"use server";
import { getStore } from "@/actions/store.action";
import { OrderCreateInputSchema, OrderPartialSchema } from "@/lib/schemas/db";
import { prisma } from "@/lib/prismadb";

export const getOrders = async () => {
  try {
    const storeId = await getStore().then((store) => store.id);

    return await prisma.order.findMany({
      where: { storeId: storeId },
      include: { product: true },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getOrder = async (orderId: string) => {
  try {
    return await prisma.order.findUnique({
      where: { id: orderId },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addOrders = async (data: any) => {
  try {
    const storeId = await getStore().then((store) => store.id);
    const parsedData = OrderCreateInputSchema.safeParse({
      quantity: data.quantity,
      product: { connect: { id: data.productId } },
      store: { connect: { id: storeId } },
    });

    if (!parsedData.success) {
      throw new Error("Invalid data");
    }

    return await prisma.order.create({
      data: { ...parsedData.data, store: { connect: { id: storeId } } },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const editOrders = async (orderId: string, data: any) => {
  try {
    const parsedData = OrderPartialSchema.safeParse(data);

    if (!parsedData.success) {
      throw new Error("Invalid data");
    }

    return await prisma.order.update({
      where: {
        id: orderId,
      },
      data: parsedData.data,
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteOrders = async (orderId: string) => {
  try {
    return await prisma.order.delete({
      where: {
        id: orderId,
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
