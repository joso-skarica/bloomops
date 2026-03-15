import { prisma } from "@/lib/prisma";
import { startOfMonth, monthsAgo } from "@/lib/format";

export async function getDashboardData() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const twelveMonthsAgo = monthsAgo(12, now);

  const [
    totalActiveProducts,
    totalSuppliers,
    lowStockProducts,
    stockAgg,
    stockValueResult,
    ordersThisMonth,
    recentShipments,
    recentOrders,
    fulfilledThisMonth,
    fulfilledLast12,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),

    prisma.supplier.count({ where: { isActive: true } }),

    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*)::bigint AS count FROM products
      WHERE is_active = true AND stock_qty <= min_stock
    `,

    prisma.product.aggregate({
      where: { isActive: true },
      _sum: { stockQty: true },
    }),

    prisma.$queryRaw<[{ value: number | null }]>`
      SELECT COALESCE(SUM(stock_qty * cost_price), 0)::float AS value
      FROM products WHERE is_active = true
    `,

    prisma.order.count({
      where: {
        createdAt: { gte: monthStart },
        status: { not: "cancelled" },
      },
    }),

    prisma.shipment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        supplier: { select: { name: true } },
        shipmentItems: { select: { quantity: true, unitCost: true } },
      },
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        customerName: true,
        totalAmount: true,
        createdAt: true,
      },
    }),

    prisma.order.findMany({
      where: {
        status: "fulfilled",
        createdAt: { gte: monthStart },
      },
      include: {
        orderItems: {
          select: { quantity: true, unitPrice: true, unitCostSnapshot: true },
        },
      },
    }),

    prisma.order.findMany({
      where: {
        status: "fulfilled",
        createdAt: { gte: twelveMonthsAgo },
      },
      include: {
        orderItems: {
          select: { quantity: true, unitPrice: true, unitCostSnapshot: true },
        },
      },
    }),
  ]);

  const lowStockCount = Number(lowStockProducts[0]?.count ?? 0);
  const totalStockUnits = stockAgg._sum.stockQty ?? 0;
  const estimatedStockValue = stockValueResult[0]?.value ?? 0;

  let grossProfitThisMonth = 0;
  for (const order of fulfilledThisMonth) {
    for (const item of order.orderItems) {
      const revenue = item.quantity * Number(item.unitPrice);
      const cost = item.quantity * Number(item.unitCostSnapshot ?? 0);
      grossProfitThisMonth += revenue - cost;
    }
  }

  const monthlyMap = new Map<string, { sales: number; profit: number }>();
  for (let i = 11; i >= 0; i--) {
    const d = monthsAgo(i, now);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, { sales: 0, profit: 0 });
  }

  for (const order of fulfilledLast12) {
    const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`;
    const bucket = monthlyMap.get(key);
    if (!bucket) continue;
    bucket.sales += Number(order.totalAmount);
    for (const item of order.orderItems) {
      const revenue = item.quantity * Number(item.unitPrice);
      const cost = item.quantity * Number(item.unitCostSnapshot ?? 0);
      bucket.profit += revenue - cost;
    }
  }

  const monthlyData = Array.from(monthlyMap.entries()).map(([key, val]) => {
    const [y, m] = key.split("-");
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const label = `${monthNames[Number(m) - 1]} ${y}`;
    return { month: label, sales: val.sales, profit: val.profit };
  });

  return {
    totalActiveProducts,
    totalSuppliers,
    lowStockCount,
    totalStockUnits,
    estimatedStockValue,
    ordersThisMonth,
    grossProfitThisMonth,
    recentShipments: recentShipments.map((s) => ({
      id: s.id,
      supplierName: s.supplier.name,
      status: s.status,
      createdAt: s.createdAt,
      total: s.shipmentItems.reduce(
        (sum, item) => sum + Number(item.unitCost) * item.quantity,
        0
      ),
    })),
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      customerName: o.customerName,
      totalAmount: Number(o.totalAmount),
      createdAt: o.createdAt,
    })),
    monthlyData,
  };
}
