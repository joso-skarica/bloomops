export const dynamic = "force-dynamic";

import { ShipmentForm } from "@/components/shipments/shipment-form";
import { prisma } from "@/lib/prisma";

export default async function NewShipmentPage() {
  const [suppliers, products] = await Promise.all([
    prisma.supplier.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        sku: true,
        unit: true,
        stockQty: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Shipment</h1>
        <p className="text-muted-foreground">Create a shipment and increase stock levels</p>
      </div>
      <ShipmentForm suppliers={suppliers} products={products} />
    </div>
  );
}
