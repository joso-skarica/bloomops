"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { supplierSchema, type SupplierFormData } from "@/lib/validations/supplier";

export type ActionResult = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function getSuppliers() {
  return prisma.supplier.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getSupplier(id: string) {
  return prisma.supplier.findUnique({
    where: { id },
    include: {
      products: { where: { isActive: true }, orderBy: { name: "asc" } },
    },
  });
}

export async function getSupplierOptions() {
  return prisma.supplier.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function createSupplier(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = supplierSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = parsed.data;

  await prisma.supplier.create({
    data: {
      name: data.name,
      contact: data.contact || null,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/suppliers");
  redirect("/suppliers");
}

export async function updateSupplier(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = supplierSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = parsed.data;

  await prisma.supplier.update({
    where: { id },
    data: {
      name: data.name,
      contact: data.contact || null,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/suppliers");
  redirect("/suppliers");
}

export async function deleteSupplier(id: string): Promise<ActionResult> {
  await prisma.supplier.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/suppliers");
  return { success: true, message: "Supplier archived" };
}
