import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "flowers",
  "plants",
  "supplies",
  "arrangements",
  "other",
] as const;

export const PRODUCT_UNITS = [
  "each",
  "bunch",
  "stem",
  "box",
  "kg",
] as const;

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  sku: z.string().max(50).optional().or(z.literal("")),
  category: z.enum(PRODUCT_CATEGORIES, {
    message: "Category is required",
  }),
  unit: z.enum(PRODUCT_UNITS).default("each"),
  costPrice: z.coerce
    .number({ message: "Cost price must be a number" })
    .min(0, "Cost price must be >= 0"),
  sellPrice: z.coerce
    .number({ message: "Sell price must be a number" })
    .min(0, "Sell price must be >= 0"),
  stockQty: z.coerce
    .number({ message: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock must be >= 0")
    .default(0),
  minStock: z.coerce
    .number({ message: "Min stock must be a number" })
    .int("Min stock must be a whole number")
    .min(0, "Min stock must be >= 0")
    .default(0),
  supplierId: z.string().optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
});

export type ProductFormData = z.infer<typeof productSchema>;
