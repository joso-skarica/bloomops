"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createSupplier,
  updateSupplier,
  type ActionResult,
} from "@/lib/actions/suppliers";
import Link from "next/link";

interface SupplierFormProps {
  supplier?: {
    id: string;
    name: string;
    contact: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    notes: string | null;
  };
}

export function SupplierForm({ supplier }: SupplierFormProps) {
  const isEditing = !!supplier;

  const action = isEditing
    ? updateSupplier.bind(null, supplier.id)
    : createSupplier;

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Supplier" : "New Supplier"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={supplier?.name ?? ""}
                placeholder="Supplier name"
              />
              {state?.errors?.name && (
                <p className="text-sm text-destructive">{state.errors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person</Label>
              <Input
                id="contact"
                name="contact"
                defaultValue={supplier?.contact ?? ""}
                placeholder="Contact name"
              />
              {state?.errors?.contact && (
                <p className="text-sm text-destructive">{state.errors.contact[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={supplier?.email ?? ""}
                placeholder="supplier@example.com"
              />
              {state?.errors?.email && (
                <p className="text-sm text-destructive">{state.errors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={supplier?.phone ?? ""}
                placeholder="+1 555 123 4567"
              />
              {state?.errors?.phone && (
                <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={supplier?.address ?? ""}
              placeholder="Full address"
              rows={2}
            />
            {state?.errors?.address && (
              <p className="text-sm text-destructive">{state.errors.address[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={supplier?.notes ?? ""}
              placeholder="Internal notes about this supplier"
              rows={3}
            />
            {state?.errors?.notes && (
              <p className="text-sm text-destructive">{state.errors.notes[0]}</p>
            )}
          </div>

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Supplier"
                  : "Create Supplier"}
            </Button>
            <Link href="/suppliers">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
