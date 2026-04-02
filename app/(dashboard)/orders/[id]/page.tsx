export const dynamic = "force-dynamic";

import Link from "next/link";
import { formatCurrency, formatDate, getOrderStatusVariant } from "@/lib/format";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderById } from "@/lib/actions/orders";
import { OrderStatusActions } from "@/components/orders/order-status-actions";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const canEdit = order.status === "draft" || order.status === "confirmed";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order {order.orderNumber}</h1>
          <p className="text-muted-foreground">Order detail and fulfillment flow</p>
        </div>
        {canEdit ? (
          <Link href={`/orders/${order.id}/edit`}>
            <Button variant="outline">Edit Order</Button>
          </Link>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Order Info
            <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <p>
            <span className="font-medium text-muted-foreground">Customer</span>
            <br />
            <span className="font-medium">{order.customerName || "-"}</span>
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Email</span>
            <br />
            {order.customerEmail || "-"}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Phone</span>
            <br />
            {order.customerPhone || "-"}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Delivery</span>
            <br />
            {order.deliveryDate
              ? formatDate(order.deliveryDate)
              : "-"}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Created</span>
            <br />
            {formatDate(order.createdAt)}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Updated</span>
            <br />
            {formatDate(order.updatedAt)}
          </p>
          <p className="md:col-span-2">
            <span className="font-medium text-muted-foreground">Notes</span>
            <br />
            {order.notes || "-"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Unit Cost Snapshot</TableHead>
                <TableHead className="text-right">Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item) => {
                const lineTotal = Number(item.unitPrice) * item.quantity;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{item.product.sku ?? "-"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(item.unitPrice))}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.unitCostSnapshot
                        ? formatCurrency(Number(item.unitCostSnapshot))
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(lineTotal)}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={5} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(Number(order.totalAmount))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusActions orderId={order.id} status={order.status} />
        </CardContent>
      </Card>
    </div>
  );
}
