export const dynamic = "force-dynamic";

import Link from "next/link";
import { formatCurrency, formatDate, getShipmentStatusVariant } from "@/lib/format";
import { DEMO_SHIPMENTS, isDemoEnabled } from "@/lib/demo-data";
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
import { PackageCheck, Plus } from "lucide-react";
import { getShipments } from "@/lib/actions/shipments";

function formatShipmentRef(id: string) {
  return "SHP-" + id.slice(-6).toUpperCase();
}

export default async function ShipmentsPage() {
  const dbShipments = await getShipments();
  const useDemo = dbShipments.length === 0 && isDemoEnabled();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">Track incoming inventory shipments</p>
        </div>
        <Link href="/shipments/new">
          <Button>
            <Plus className="size-4" />
            New Shipment
          </Button>
        </Link>
      </div>

      {useDemo ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_SHIPMENTS.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell>
                    <span className="font-medium font-mono text-xs">
                      {shipment.id.replace("demo-", "").toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{shipment.supplier.name}</TableCell>
                  <TableCell>
                    <Badge variant={getShipmentStatusVariant(shipment.status)}>{shipment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {shipment.receivedAt ? formatDate(new Date(shipment.receivedAt)) : "-"}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(shipment.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : dbShipments.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
          <PackageCheck className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-foreground">No shipments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first shipment to start tracking inventory.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dbShipments.map((shipment) => {
                const total = shipment.shipmentItems.reduce(
                  (sum, item) => sum + Number(item.unitCost) * item.quantity,
                  0
                );

                return (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      <Link href={`/shipments/${shipment.id}`} className="font-medium font-mono text-xs hover:underline underline-offset-4">
                        {formatShipmentRef(shipment.id)}
                      </Link>
                    </TableCell>
                    <TableCell>{shipment.supplier.name}</TableCell>
                    <TableCell>
                      <Badge variant={getShipmentStatusVariant(shipment.status)}>{shipment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {shipment.receivedAt ? formatDate(shipment.receivedAt) : "-"}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(total)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
