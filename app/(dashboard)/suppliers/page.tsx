import Link from "next/link";
import { getSuppliers } from "@/lib/actions/suppliers";
import { DEMO_SUPPLIERS } from "@/lib/demo-data";
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
import { Plus, Mail, Phone, Building2 } from "lucide-react";

export default async function SuppliersPage() {
  const dbSuppliers = await getSuppliers();

  const useDemo = dbSuppliers.length === 0;
  const suppliers = useDemo ? DEMO_SUPPLIERS : dbSuppliers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your flower and plant suppliers
          </p>
        </div>
        <Link href="/suppliers/new">
          <Button>
            <Plus className="size-4" />
            Add Supplier
          </Button>
        </Link>
      </div>

      {suppliers.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
          <Building2 className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-foreground">No suppliers yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first supplier to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <Link
                      href={useDemo ? "#" : `/suppliers/${supplier.id}`}
                      className="font-medium hover:underline underline-offset-4"
                    >
                      {supplier.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.contact || "—"}
                  </TableCell>
                  <TableCell>
                    {supplier.email ? (
                      <span className="flex items-center gap-1.5 text-sm">
                        <Mail className="size-3.5 text-muted-foreground" />
                        {supplier.email}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {supplier.phone ? (
                      <span className="flex items-center gap-1.5 text-sm">
                        <Phone className="size-3.5 text-muted-foreground" />
                        {supplier.phone}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">
                      {supplier._count.products}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
