import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupplier } from "@/lib/actions/suppliers";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import { ChevronLeft } from "lucide-react";

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await getSupplier(id);

  if (!supplier) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={`/suppliers/${supplier.id}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to {supplier.name}
        </Link>
      </div>
      <SupplierForm
        supplier={{
          id: supplier.id,
          name: supplier.name,
          contact: supplier.contact,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          notes: supplier.notes,
        }}
      />
    </div>
  );
}
