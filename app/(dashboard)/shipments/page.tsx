export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getShipments } from "@/lib/actions/shipments";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function ShipmentsPage() {
  const shipments = await getShipments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">Track incoming inventory shipments</p>
        </div>
        <Link href="/shipments/new">
          <Button>New Shipment</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No shipments yet.
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((shipment) => {
                  const total = shipment.shipmentItems.reduce(
                    (sum, item) => sum + Number(item.unitCost) * item.quantity,
                    0
                  );

                  return (
                    <TableRow key={shipment.id}>
                      <TableCell>
                        <Link href={`/shipments/${shipment.id}`} className="underline">
                          {shipment.id.slice(0, 8)}...
                        </Link>
                      </TableCell>
                      <TableCell>{shipment.supplier.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{shipment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {shipment.receivedAt
                          ? new Date(shipment.receivedAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(total)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
