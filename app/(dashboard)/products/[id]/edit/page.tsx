import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "@/lib/actions/products";
import { getSupplierOptions } from "@/lib/actions/suppliers";
import { ProductForm } from "@/components/products/product-form";
import { ChevronLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, suppliers] = await Promise.all([
    getProduct(id),
    getSupplierOptions(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={`/products/${product.id}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to {product.name}
        </Link>
      </div>
      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category,
          unit: product.unit,
          costPrice: Number(product.costPrice),
          sellPrice: Number(product.sellPrice),
          stockQty: product.stockQty,
          minStock: product.minStock,
          supplierId: product.supplierId,
          description: product.description,
        }}
        suppliers={suppliers}
      />
    </div>
  );
}
