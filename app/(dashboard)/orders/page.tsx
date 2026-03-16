export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrders } from "@/lib/actions/orders";
import { formatCurrency, getOrderStatusVariant } from "@/lib/format";
import { OrderSearch } from "@/components/orders/order-search";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const orders = await getOrders({ search: sp.search, status: sp.status });

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

      <Card>
        <CardHeader>
          <CardTitle>
            {orders.length === 0 && (sp.search || sp.status)
              ? "No orders match your filters"
              : `All Orders`}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {sp.search || sp.status
                      ? "No orders match your filters."
                      : "No orders yet."}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/orders/${order.id}`} className="underline">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customerName || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {order.deliveryDate
                        ? new Date(order.deliveryDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(order.totalAmount))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
