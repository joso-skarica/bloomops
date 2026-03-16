import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getStockHistory } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
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
import { formatCurrency, formatDate } from "@/lib/format";
import { ArchiveProductButton } from "@/components/products/archive-product-button";
import {
  ChevronLeft,
  Pencil,
  Package,
  DollarSign,
  Layers,
  AlertTriangle,
} from "lucide-react";

const stockHistoryLabels: Record<string, string> = {
  shipment_in: "Shipment received",
  order_out: "Order fulfilled",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, history] = await Promise.all([
    getProduct(id),
    getStockHistory(id),
  ]);

  if (!product) notFound();

  const lowStock =
    product.isActive &&
    product.stockQty <= product.minStock &&
    product.minStock > 0;

  const margin =
    Number(product.sellPrice) > 0
      ? (
          ((Number(product.sellPrice) - Number(product.costPrice)) /
            Number(product.sellPrice)) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/products"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to products
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {product.name}
            </h1>
            {!product.isActive && <Badge variant="outline">Archived</Badge>}
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            {product.sku && (
              <span className="font-mono">{product.sku}</span>
            )}
            <Badge variant="secondary">{product.category}</Badge>
            <span>per {product.unit}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/products/${product.id}/edit`}>
            <Button variant="outline">
              <Pencil className="size-4" />
              Edit
            </Button>
          </Link>
          <ArchiveProductButton
            id={product.id}
            name={product.name}
            isActive={product.isActive}
            redirectOnArchive
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cost Price</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(product.costPrice)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sell Price</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(product.sellPrice)}
            </div>
            <p className="text-xs text-muted-foreground">{margin}% margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Layers className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{product.stockQty}</span>
              {lowStock && (
                <AlertTriangle className="size-5 text-amber-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Min: {product.minStock}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Supplier</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {product.supplier ? (
              <Link
                href={`/suppliers/${product.supplier.id}`}
                className="text-lg font-semibold hover:underline"
              >
                {product.supplier.name}
              </Link>
            ) : (
              <p className="text-lg text-muted-foreground">None</p>
            )}
          </CardContent>
        </Card>
      </div>

      {product.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm">{product.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No stock movements recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty Change</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </TableCell>
                    <TableCell>
                      {stockHistoryLabels[entry.type] ?? entry.type}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={entry.quantity > 0 ? "text-green-600" : "text-destructive"}>
                        {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.notes ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
