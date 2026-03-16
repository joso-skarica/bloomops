"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { productSchema, type ProductFormData } from "@/lib/validations/product";

export type ActionResult = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function getProducts(opts?: {
  search?: string;
  category?: string;
  showArchived?: boolean;
}) {
  const where: Record<string, unknown> = {};

  if (!opts?.showArchived) {
    where.isActive = true;
  }

  if (opts?.search) {
    where.OR = [
      { name: { contains: opts.search, mode: "insensitive" } },
      { sku: { contains: opts.search, mode: "insensitive" } },
    ];
  }

  if (opts?.category && opts.category !== "all") {
    where.category = opts.category;
  }

  return prisma.product.findMany({
    where,
    include: { supplier: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { supplier: { select: { id: true, name: true } } },
  });
}

export async function createProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = parsed.data;

  const existing = data.sku
    ? await prisma.product.findUnique({ where: { sku: data.sku } })
    : null;
  if (existing) {
    return { success: false, errors: { sku: ["This SKU is already in use"] } };
  }

  await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku || null,
      category: data.category,
      unit: data.unit,
      costPrice: data.costPrice,
      sellPrice: data.sellPrice,
      stockQty: data.stockQty,
      minStock: data.minStock,
      supplierId: data.supplierId || null,
      description: data.description || null,
    },
  });

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = parsed.data;

  if (data.sku) {
    const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existing && existing.id !== id) {
      return { success: false, errors: { sku: ["This SKU is already in use"] } };
    }
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      sku: data.sku || null,
      category: data.category,
      unit: data.unit,
      costPrice: data.costPrice,
      sellPrice: data.sellPrice,
      stockQty: data.stockQty,
      minStock: data.minStock,
      supplierId: data.supplierId || null,
      description: data.description || null,
    },
  });

  revalidatePath("/products");
  redirect("/products");
}

export async function archiveProduct(id: string): Promise<ActionResult> {
  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/products");
  return { success: true, message: "Product archived" };
}

export async function restoreProduct(id: string): Promise<ActionResult> {
  await prisma.product.update({
    where: { id },
    data: { isActive: true },
  });

  revalidatePath("/products");
  return { success: true, message: "Product restored" };
}

export async function getStockHistory(productId: string) {
  return prisma.stockHistory.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
