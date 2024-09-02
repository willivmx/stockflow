"use server";
import { getStore } from "@/actions/store.action";
import {
  ProductCreateInputSchema,
  ProductPartialSchema,
} from "@/lib/schemas/db";
import { prisma } from "@/lib/prismadb";

export const getProducts = async () => {
  try {
    const storeId = await getStore().then((store) => store.id);

    return await prisma.product.findMany({
      where: { storeId: storeId },
      include: { orders: true, category: true },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getProduct = async (productId: string) => {
  try {
    return await prisma.product.findUnique({
      where: { id: productId },
      include: { orders: true },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addProduct = async (data: any) => {
  try {
    const storeId = await getStore().then((store) => store.id);

    const parsedData = ProductCreateInputSchema.safeParse({
      name: data.name,
      description: data.description,
      price: data.price,
      store: { connect: { id: storeId } },
      category: { connect: { id: data.categoryId } },
    });

    if (!parsedData.success) {
      console.log(JSON.stringify(parsedData.error));
      throw new Error("Invalid data");
    }

    return await prisma.product.create({
      data: { ...parsedData.data, store: { connect: { id: storeId } } },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const editProduct = async (productId: string, data: any) => {
  try {
    const parsedData = ProductPartialSchema.safeParse(data);

    if (!parsedData.success) {
      throw new Error("Invalid data");
    }

    return await prisma.product.update({
      where: {
        id: productId,
      },
      data: parsedData.data,
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const ordersCount = await prisma.order.count({
      where: { productId: productId },
    });

    if (ordersCount > 0) {
      throw new Error("Product is not empty");
    }

    return await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
