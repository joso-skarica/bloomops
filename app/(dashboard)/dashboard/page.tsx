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
import { DEMO_DASHBOARD, isDemoEnabled } from "@/lib/demo-data";
import { formatCurrency, formatDate, formatNumber, getOrderStatusVariant, getShipmentStatusVariant } from "@/lib/format";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";

export default async function DashboardPage() {
  const dbData = await getDashboardData();

  const useDemo = dbData.totalActiveProducts === 0 && isDemoEnabled();
  const data = useDemo ? DEMO_DASHBOARD : dbData;

  const topKpis = [
    {
      label: "Active Products",
      value: formatNumber(data.totalActiveProducts),
      icon: Package,
    },
    {
      label: "Suppliers",
      value: formatNumber(data.totalSuppliers),
      icon: Truck,
    },
    {
      label: "Low Stock Items",
      value: formatNumber(data.lowStockCount),
      icon: AlertTriangle,
      warn: data.lowStockCount > 0,
    },
    {
      label: "Total Stock Units",
      value: formatNumber(data.totalStockUnits),
      icon: Boxes,
    },
  ];

  const bottomKpis = [
    {
      label: "Est. Stock Value",
      value: formatCurrency(data.estimatedStockValue),
      icon: DollarSign,
    },
    {
      label: "Orders This Month",
      value: formatNumber(data.ordersThisMonth),
      icon: ShoppingCart,
    },
    {
      label: "Gross Profit (Month)",
      value: formatCurrency(data.grossProfitThisMonth),
      icon: TrendingUp,
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bottomKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

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

      <div className="grid gap-4 lg:grid-cols-2">
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
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      No shipments yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.recentShipments.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        {useDemo ? (
                          <span className="font-medium">{s.supplierName}</span>
                        ) : (
                          <Link
                            href={`/shipments/${s.id}`}
                            className="font-medium hover:underline underline-offset-4"
                          >
                            {s.supplierName}
                          </Link>
                        )}
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
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.recentOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>
                        {useDemo ? (
                          <span className="font-medium">{o.orderNumber}</span>
                        ) : (
                          <Link
                            href={`/orders/${o.id}`}
                            className="font-medium hover:underline underline-offset-4"
                          >
                            {o.orderNumber}
                          </Link>
                        )}
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

function KpiCard({ label, value, icon: Icon, warn }: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  warn?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          warn ? "bg-amber-100 dark:bg-amber-950/30" : "bg-primary/10"
        )}>
          <Icon className={cn(
            "size-4",
            warn ? "text-amber-600 dark:text-amber-500" : "text-primary"
          )} />
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn("text-2xl font-bold", warn && "text-amber-600 dark:text-amber-500")}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
