export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { formatCurrency, formatDate, getShipmentStatusVariant } from "@/lib/format";
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
import { getShipmentById } from "@/lib/actions/shipments";

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shipment = await getShipmentById(id);

  if (!shipment) {
    notFound();
  }

  const total = shipment.shipmentItems.reduce(
    (sum, item) => sum + Number(item.unitCost) * item.quantity,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shipment Detail</h1>
        <p className="text-muted-foreground">Shipment {shipment.id.slice(0, 8)}...</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Shipment Info
            <Badge variant={getShipmentStatusVariant(shipment.status)}>{shipment.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <p>
            <span className="font-medium text-muted-foreground">Supplier</span>
            <br />
            <span className="font-medium">{shipment.supplier.name}</span>
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Received</span>
            <br />
            {shipment.receivedAt
              ? formatDate(shipment.receivedAt)
              : "Not received"}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Expected</span>
            <br />
            {shipment.expectedAt
              ? formatDate(shipment.expectedAt)
              : "-"}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Created</span>
            <br />
            {formatDate(shipment.createdAt)}
          </p>
          <p className="md:col-span-2">
            <span className="font-medium text-muted-foreground">Notes</span>
            <br />
            {shipment.notes || "-"}
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
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipment.shipmentItems.map((item) => {
                const lineTotal = Number(item.unitCost) * item.quantity;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{item.product.sku ?? "-"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(item.unitCost))}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(lineTotal)}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
