import { ProductForm } from "@/components/products/product-form";
import { getSupplierOptions } from "@/lib/actions/suppliers";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProductPage() {
  const suppliers = await getSupplierOptions();

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
      <ProductForm suppliers={suppliers} />
    </div>
  );
}
