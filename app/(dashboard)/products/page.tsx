import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/actions/products";
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
import { formatCurrency } from "@/lib/format";
import { ProductSearch } from "@/components/products/product-search";
import { ArchiveProductButton } from "@/components/products/archive-product-button";
import { Plus, AlertTriangle, Package } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    archived?: string;
  }>;
}) {
  const sp = await searchParams;
  const products = await getProducts({
    search: sp.search,
    category: sp.category,
    showArchived: sp.archived === "true",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your flower and plant inventory
          </p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="size-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Suspense>
        <ProductSearch />
      </Suspense>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
          <Package className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-foreground">
              {sp.search || sp.category ? "No products match your filters" : "No products yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {sp.search || sp.category
                ? "Try adjusting your search or filters."
                : "Add your first product to get started."}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Sell</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const lowStock =
                  product.isActive &&
                  product.stockQty <= product.minStock &&
                  product.minStock > 0;

                return (
                  <TableRow
                    key={product.id}
                    className={!product.isActive ? "opacity-50" : ""}
                  >
                    <TableCell>
                      <Link
                        href={`/products/${product.id}`}
                        className="font-medium hover:underline underline-offset-4"
                      >
                        {product.name}
                      </Link>
                      {!product.isActive && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Archived
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {product.sku || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.supplier?.name || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.costPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.sellPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        {lowStock && (
                          <AlertTriangle className="size-3.5 text-amber-500" />
                        )}
                        {product.stockQty}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <ArchiveProductButton
                        id={product.id}
                        name={product.name}
                        isActive={product.isActive}
                      />
                    </TableCell>
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
