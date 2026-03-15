import { z } from "zod";

export const orderStatusSchema = z.enum([
  "draft",
  "confirmed",
  "fulfilled",
  "cancelled",
]);

const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z
    .number({ error: "Quantity must be a number" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  unitPrice: z
    .number({ error: "Unit price must be a number" })
    .positive("Unit price must be greater than 0"),
});

export const orderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Customer name is required")
    .max(120, "Customer name must be 120 characters or less"),
  customerEmail: z
    .string()
    .trim()
    .email("Customer email is invalid")
    .optional()
    .or(z.literal("")),
  customerPhone: z.string().trim().max(60).optional().or(z.literal("")),
  deliveryDate: z.string().optional().nullable(),
  notes: z.string().max(2000, "Notes must be 2000 characters or less").optional(),
  status: z.enum(["draft", "confirmed"]).default("draft"),
  items: z.array(orderItemSchema).min(1, "At least one line item is required"),
});

export const orderStatusUpdateSchema = z.object({
  status: orderStatusSchema,
});

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
