import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { shipmentSchema, type ShipmentInput } from "@/lib/validations/shipment";

function parseExpectedAt(value?: string | null) {
  if (!value || value.trim() === "") return null;
  return new Date(value);
}

export async function getShipments() {
  return prisma.shipment.findMany({
    include: {
      supplier: { select: { id: true, name: true } },
      shipmentItems: {
        include: {
          product: { select: { id: true, name: true, sku: true, unit: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getShipmentById(id: string) {
  return prisma.shipment.findUnique({
    where: { id },
    include: {
      supplier: { select: { id: true, name: true, contact: true, email: true, phone: true } },
      shipmentItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: true,
            },
          },
        },
      },
    },
  });
}

export async function createShipment(input: ShipmentInput) {
  const payload = shipmentSchema.parse(input);

  const productIds = payload.items.map((item) => item.productId);

  return prisma.$transaction(async (tx) => {
    const existingProducts = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    if (existingProducts.length !== productIds.length) {
      throw new Error("One or more selected products are invalid.");
    }

    const shipment = await tx.shipment.create({
      data: {
        supplierId: payload.supplierId,
        status: "received",
        expectedAt: parseExpectedAt(payload.expectedAt),
        receivedAt: new Date(),
        notes: payload.notes,
      },
    });

    if (payload.items.length > 0) {
      await tx.shipmentItem.createMany({
        data: payload.items.map((item) => ({
          shipmentId: shipment.id,
          productId: item.productId,
          quantity: item.quantity,
          unitCost: new Prisma.Decimal(item.unitCost),
        })),
      });
    }

    for (const item of payload.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQty: {
            increment: item.quantity,
          },
        },
      });

      await tx.stockHistory.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          type: "shipment_in",
          referenceId: shipment.id,
          notes: "Stock increased from shipment receipt",
        },
      });
    }

    return shipment;
  });
}
