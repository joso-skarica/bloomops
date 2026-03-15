export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

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
        <p className="text-muted-foreground">Shipment {shipment.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Shipment Info
            <Badge variant="outline">{shipment.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="font-medium">Supplier:</span> {shipment.supplier.name}
          </p>
          <p>
            <span className="font-medium">Received:</span>{" "}
            {shipment.receivedAt
              ? new Date(shipment.receivedAt).toLocaleString()
              : "Not received"}
          </p>
          <p>
            <span className="font-medium">Expected:</span>{" "}
            {shipment.expectedAt
              ? new Date(shipment.expectedAt).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <span className="font-medium">Created:</span>{" "}
            {new Date(shipment.createdAt).toLocaleString()}
          </p>
          <p className="md:col-span-2">
            <span className="font-medium">Notes:</span> {shipment.notes || "-"}
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
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.product.sku ?? "-"}</TableCell>
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
