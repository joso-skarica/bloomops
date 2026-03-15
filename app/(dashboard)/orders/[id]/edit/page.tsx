export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { OrderForm } from "@/components/orders/order-form";
import { getOrderById } from "@/lib/actions/orders";
import { prisma } from "@/lib/prisma";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [order, products] = await Promise.all([
    getOrderById(id),
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        sku: true,
        sellPrice: true,
        stockQty: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!order) {
    notFound();
  }

  if (order.status !== "draft" && order.status !== "confirmed") {
    redirect(`/orders/${order.id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Order</h1>
        <p className="text-muted-foreground">Update order details before fulfillment</p>
      </div>

      <OrderForm
        mode="edit"
        orderId={order.id}
        products={products.map((product) => ({
          ...product,
          sellPrice: Number(product.sellPrice),
        }))}
        initialValues={{
          customerName: order.customerName ?? "",
          customerEmail: order.customerEmail ?? "",
          customerPhone: order.customerPhone ?? "",
          deliveryDate: order.deliveryDate
            ? new Date(order.deliveryDate).toISOString().split("T")[0]
            : "",
          notes: order.notes ?? "",
          status: order.status === "confirmed" ? "confirmed" : "draft",
          items: order.orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
          })),
        }}
      />
    </div>
  );
}
