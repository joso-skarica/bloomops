import { z } from "zod";

const shipmentItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z
    .number({ error: "Quantity must be a number" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  unitCost: z
    .number({ error: "Unit cost must be a number" })
    .positive("Unit cost must be greater than 0"),
});

export const shipmentSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  expectedAt: z.string().optional().nullable(),
  notes: z.string().max(2000, "Notes must be 2000 characters or less").optional(),
  items: z.array(shipmentItemSchema).min(1, "At least one line item is required"),
});

export type ShipmentInput = z.infer<typeof shipmentSchema>;
