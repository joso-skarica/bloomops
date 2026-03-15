export const dynamic = "force-dynamic";

import { OrderForm } from "@/components/orders/order-form";
import { prisma } from "@/lib/prisma";

export default async function NewOrderPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      sku: true,
      sellPrice: true,
      stockQty: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Order</h1>
        <p className="text-muted-foreground">Create a draft or confirmed order</p>
      </div>
      <OrderForm
        mode="create"
        products={products.map((product) => ({
          ...product,
          sellPrice: Number(product.sellPrice),
        }))}
      />
    </div>
  );
}
