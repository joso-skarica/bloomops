export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Package,
  Truck,
  AlertTriangle,
  Boxes,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardData } from "@/lib/actions/dashboard";
import { formatCurrency, formatDate, formatNumber, getOrderStatusVariant, getShipmentStatusVariant } from "@/lib/format";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";

const kpiIcons = {
  products: Package,
  suppliers: Truck,
  lowStock: AlertTriangle,
  stockUnits: Boxes,
  stockValue: DollarSign,
  orders: ShoppingCart,
  profit: TrendingUp,
} as const;

export default async function DashboardPage() {
  const data = await getDashboardData();

  const kpis = [
    {
      label: "Active Products",
      value: formatNumber(data.totalActiveProducts),
      icon: kpiIcons.products,
    },
    {
      label: "Suppliers",
      value: formatNumber(data.totalSuppliers),
      icon: kpiIcons.suppliers,
    },
    {
      label: "Low Stock Items",
      value: formatNumber(data.lowStockCount),
      icon: kpiIcons.lowStock,
    },
    {
      label: "Total Stock Units",
      value: formatNumber(data.totalStockUnits),
      icon: kpiIcons.stockUnits,
    },
    {
      label: "Est. Stock Value",
      value: formatCurrency(data.estimatedStockValue),
      icon: kpiIcons.stockValue,
    },
    {
      label: "Orders This Month",
      value: formatNumber(data.ordersThisMonth),
      icon: kpiIcons.orders,
    },
    {
      label: "Gross Profit (Month)",
      value: formatCurrency(data.grossProfitThisMonth),
      icon: kpiIcons.profit,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your florist operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isLowStock = kpi.label === "Low Stock Items";
          const hasLowStock = isLowStock && data.lowStockCount > 0;

          return (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    hasLowStock
                      ? "bg-amber-100 dark:bg-amber-950/30"
                      : "bg-primary/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      hasLowStock
                        ? "text-amber-600 dark:text-amber-500"
                        : "text-primary"
                    )}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    hasLowStock && "text-amber-600 dark:text-amber-500"
                  )}
                >
                  {kpi.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <MonthlyChart
          title="Monthly Sales"
          data={data.monthlyData.map((d) => ({ month: d.month, value: d.sales }))}
        />
        <MonthlyChart
          title="Monthly Gross Profit"
          data={data.monthlyData.map((d) => ({ month: d.month, value: d.profit }))}
          color="oklch(0.68 0.15 52)"
        />
      </div>

      {/* Recent Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Shipments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Shipments</CardTitle>
            <Link href="/shipments" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      No shipments yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.recentShipments.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <Link href={`/shipments/${s.id}`} className="font-medium hover:underline underline-offset-4">
                          {s.supplierName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getShipmentStatusVariant(s.status)}>{s.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(s.createdAt)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(s.total)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Link href="/orders" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.recentOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>
                        <Link href={`/orders/${o.id}`} className="font-medium hover:underline underline-offset-4">
                          {o.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{o.customerName || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={getOrderStatusVariant(o.status)}>{o.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(o.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
