import { prisma } from "@/lib/prisma";
import { monthsAgo } from "@/lib/format";

export async function getReportsData() {
  const now = new Date();
  const twelveMonthsAgo = monthsAgo(12, now);

  const [
    allActiveProducts,
    fulfilledOrders,
  ] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { supplier: { select: { name: true } } },
      orderBy: { stockQty: "asc" },
    }),

    prisma.order.findMany({
      where: {
        status: "fulfilled",
        createdAt: { gte: twelveMonthsAgo },
      },
      include: {
        orderItems: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const lowStockProducts = allActiveProducts.filter(
    (p) => p.stockQty <= p.minStock
  );

  // --- Top-selling products ---
  const productSalesMap = new Map<
    string,
    { name: string; sku: string | null; totalQty: number; totalRevenue: number }
  >();

  // --- Monthly buckets ---
  const monthlyMap = new Map<string, { sales: number; profit: number }>();
  for (let i = 11; i >= 0; i--) {
    const d = monthsAgo(i, now);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, { sales: 0, profit: 0 });
  }

  for (const order of fulfilledOrders) {
    const monthKey = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`;
    const bucket = monthlyMap.get(monthKey);

    if (bucket) {
      bucket.sales += Number(order.totalAmount);
    }

    for (const item of order.orderItems) {
      const revenue = item.quantity * Number(item.unitPrice);
      const cost = item.quantity * Number(item.unitCostSnapshot ?? 0);

      if (bucket) {
        bucket.profit += revenue - cost;
      }

      const existing = productSalesMap.get(item.productId);
      if (existing) {
        existing.totalQty += item.quantity;
        existing.totalRevenue += revenue;
      } else {
        productSalesMap.set(item.productId, {
          name: item.product.name,
          sku: item.product.sku,
          totalQty: item.quantity,
          totalRevenue: revenue,
        });
      }
    }
  }

  const topSellingProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, 10);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const monthlySalesTotals = Array.from(monthlyMap.entries()).map(([key, val]) => {
    const [y, m] = key.split("-");
    return { month: `${monthNames[Number(m) - 1]} ${y}`, totalSales: val.sales };
  });

  const monthlyGrossProfitTotals = Array.from(monthlyMap.entries()).map(([key, val]) => {
    const [y, m] = key.split("-");
    return { month: `${monthNames[Number(m) - 1]} ${y}`, grossProfit: val.profit };
  });

  // --- Stock value by category ---
  const categoryMap = new Map<string, { totalUnits: number; totalValue: number }>();
  for (const p of allActiveProducts) {
    const existing = categoryMap.get(p.category);
    const value = p.stockQty * Number(p.costPrice);
    if (existing) {
      existing.totalUnits += p.stockQty;
      existing.totalValue += value;
    } else {
      categoryMap.set(p.category, { totalUnits: p.stockQty, totalValue: value });
    }
  }

  const stockValueSummary = Array.from(categoryMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.totalValue - a.totalValue);

  return {
    lowStockProducts: lowStockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      stockQty: p.stockQty,
      minStock: p.minStock,
      supplierName: p.supplier?.name ?? "-",
    })),
    topSellingProducts,
    monthlySalesTotals,
    monthlyGrossProfitTotals,
    stockValueSummary,
  };
}
