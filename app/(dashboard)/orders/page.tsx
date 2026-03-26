export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrders } from "@/lib/actions/orders";
import { DEMO_ORDERS } from "@/lib/demo-data";
import { formatCurrency, formatDate, getOrderStatusVariant } from "@/lib/format";
import { OrderSearch } from "@/components/orders/order-search";
import { ShoppingCart } from "lucide-react";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const dbOrders = await getOrders({ search: sp.search, status: sp.status });

  const hasFilters = !!(sp.search || sp.status);
  const useDemo = dbOrders.length === 0 && !hasFilters;
  const orders = useDemo ? DEMO_ORDERS : dbOrders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
        <Link href="/orders/new">
          <Button>New Order</Button>
        </Link>
      </div>

      <Suspense>
        <OrderSearch />
      </Suspense>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
          <ShoppingCart className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-foreground">
              {hasFilters ? "No orders match your filters" : "No orders yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasFilters
                ? "Try adjusting your search or filters."
                : "Create your first order to get started."}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={useDemo ? "#" : `/orders/${order.id}`}
                      className="font-medium hover:underline underline-offset-4"
                    >
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customerName || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {order.deliveryDate
                      ? formatDate(new Date(order.deliveryDate))
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(Number(order.totalAmount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
