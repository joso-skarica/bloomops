import { SupplierForm } from "@/components/suppliers/supplier-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewSupplierPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/suppliers"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to suppliers
        </Link>
      </div>
      <SupplierForm />
    </div>
  );
}
