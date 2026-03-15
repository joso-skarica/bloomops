import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  orderSchema,
  orderStatusUpdateSchema,
  type OrderInput,
  type OrderStatus,
} from "@/lib/validations/order";
import { generateOrderNumber } from "@/lib/order-number";

function parseDeliveryDate(value?: string | null) {
  if (!value || value.trim() === "") return null;
  return new Date(value);
}

function calculateOrderTotal(items: Array<{ quantity: number; unitPrice: number }>) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          product: { select: { id: true, name: true, sku: true, unit: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: true,
              stockQty: true,
            },
          },
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function createOrder(input: OrderInput) {
  const payload = orderSchema.parse(input);
  const productIds = payload.items.map((item) => item.productId);

  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, costPrice: true },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more selected products are invalid.");
    }

    const productCostMap = new Map(products.map((product) => [product.id, product.costPrice]));
    const orderNumber = await generateOrderNumber(tx);
    const totalAmount = calculateOrderTotal(payload.items);

    const order = await tx.order.create({
      data: {
        orderNumber,
        status: payload.status,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail || null,
        customerPhone: payload.customerPhone || null,
        deliveryDate: parseDeliveryDate(payload.deliveryDate),
        notes: payload.notes,
        totalAmount: new Prisma.Decimal(totalAmount),
      },
    });

    await tx.orderItem.createMany({
      data: payload.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: new Prisma.Decimal(item.unitPrice),
        unitCostSnapshot: productCostMap.get(item.productId) ?? null,
      })),
    });

    return order;
  });
}

export async function updateOrder(id: string, input: OrderInput) {
  const payload = orderSchema.parse(input);
  const order = await prisma.order.findUnique({ where: { id }, select: { status: true } });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.status === "fulfilled" || order.status === "cancelled") {
    throw new Error("Only draft or confirmed orders can be edited.");
  }

  const productIds = payload.items.map((item) => item.productId);

  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, costPrice: true },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more selected products are invalid.");
    }

    const productCostMap = new Map(products.map((product) => [product.id, product.costPrice]));
    const totalAmount = calculateOrderTotal(payload.items);

    const updated = await tx.order.update({
      where: { id },
      data: {
        status: payload.status,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail || null,
        customerPhone: payload.customerPhone || null,
        deliveryDate: parseDeliveryDate(payload.deliveryDate),
        notes: payload.notes,
        totalAmount: new Prisma.Decimal(totalAmount),
      },
    });

    await tx.orderItem.deleteMany({ where: { orderId: id } });
    await tx.orderItem.createMany({
      data: payload.items.map((item) => ({
        orderId: id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: new Prisma.Decimal(item.unitPrice),
        unitCostSnapshot: productCostMap.get(item.productId) ?? null,
      })),
    });

    return updated;
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const payload = orderStatusUpdateSchema.parse({ status });

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, stockQty: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.status === "fulfilled" && payload.status === "cancelled") {
      throw new Error("Fulfilled orders cannot be cancelled in MVP.");
    }

    if (payload.status === "fulfilled" && order.status !== "fulfilled") {
      const insufficient = order.orderItems.find(
        (item) => item.product.stockQty < item.quantity
      );

      if (insufficient) {
        throw new Error(
          `Cannot fulfill order: ${insufficient.product.name} would go below zero stock.`
        );
      }

      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQty: {
              decrement: item.quantity,
            },
          },
        });

        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            quantity: item.quantity * -1,
            type: "order_out",
            referenceId: order.id,
            notes: "Stock reduced from fulfilled order",
          },
        });
      }
    }

    return tx.order.update({
      where: { id },
      data: { status: payload.status },
    });
  });
}
