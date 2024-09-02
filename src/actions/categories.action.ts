"use server";
import { getStore } from "@/actions/store.action";
import {
  CategoryCreateInputSchema,
  CategoryPartialSchema,
} from "@/lib/schemas/db";
import { prisma } from "@/lib/prismadb";

export const getCategories = async () => {
  try {
    const storeId = await getStore().then((store) => store.id);

    return await prisma.category.findMany({
      where: { storeId: storeId },
      include: { products: true },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCategory = async (categoryId: string) => {
  try {
    return await prisma.category.findUnique({
      where: { id: categoryId },
      include: { products: true },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addCategory = async (data: any) => {
  try {
    const storeId = await getStore().then((store) => store.id);

    const parsedData = CategoryCreateInputSchema.safeParse({
      ...data,
      store: { connect: { id: storeId } },
    });

    if (!parsedData.success) {
      throw new Error("Invalid data");
    }

    const categoryNameExists = await prisma.category.findFirst({
      where: { name: parsedData.data.name, storeId: storeId },
    });

    if (categoryNameExists) {
      throw new Error("Category name already exists");
    }

    return await prisma.category.create({
      data: { ...parsedData.data, store: { connect: { id: storeId } } },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const editCategory = async (categoryId: string, data: any) => {
  try {
    const parsedData = CategoryPartialSchema.safeParse(data);

    if (!parsedData.success) {
      throw new Error("Invalid data");
    }

    return await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: parsedData.data,
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteCategory = async (categoryId: string) => {
  const storeId = await getStore().then((store) => store.id);

  try {
    const productCount = await prisma.product.count({
      where: { categoryId: categoryId },
    });

    if (productCount > 0) {
      throw new Error("Category is not empty");
    }

    return await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
