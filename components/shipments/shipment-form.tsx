"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PICK_SUPPLIER = "__pick_supplier__";
const PICK_PRODUCT = "__pick_product__";

type SupplierOption = {
  id: string;
  name: string;
};

type ProductOption = {
  id: string;
  name: string;
  sku: string | null;
};

type ShipmentLineItem = {
  productId: string;
  quantity: number;
  unitCost: number;
};

interface ShipmentFormProps {
  suppliers: SupplierOption[];
  products: ProductOption[];
  mode?: "create" | "edit";
  shipmentId?: string;
  initialValues?: {
    supplierId: string;
    expectedDate: string;
    receivedDate: string;
    notes: string;
    status: "pending" | "received";
    items: ShipmentLineItem[];
  };
}

function productLineLabel(
  products: ProductOption[],
  productId: string
): string | undefined {
  if (!productId) return undefined;
  const p = products.find((x) => x.id === productId);
  if (!p) return undefined;
  return p.sku ? `${p.name} (${p.sku})` : p.name;
}

export function ShipmentForm({
  suppliers,
  products,
  mode = "create",
  shipmentId,
  initialValues,
}: ShipmentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [supplierId, setSupplierId] = useState(initialValues?.supplierId ?? "");
  const [expectedDate, setExpectedDate] = useState(initialValues?.expectedDate ?? "");
  const [receivedDate, setReceivedDate] = useState(initialValues?.receivedDate ?? "");
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [status, setStatus] = useState<"pending" | "received">(
    initialValues?.status ?? "pending"
  );
  const [items, setItems] = useState<ShipmentLineItem[]>(
    initialValues?.items?.length
      ? initialValues.items
      : [{ productId: "", quantity: 1, unitCost: 0 }]
  );

  const totalCost = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

  const updateItem = (index: number, patch: Partial<ShipmentLineItem>) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { productId: "", quantity: 1, unitCost: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const payload = {
        supplierId,
        expectedDate,
        receivedDate,
        notes,
        status,
        items,
      };

      const endpoint =
        mode === "create" ? "/api/shipments" : `/api/shipments/${shipmentId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const msg = result.error ?? "Failed to save shipment.";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success(
        mode === "create"
          ? "Shipment created successfully."
          : "Shipment updated successfully."
      );
      router.push(`/shipments/${result.data.id}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <Select
              value={supplierId || PICK_SUPPLIER}
              onValueChange={(value) =>
                setSupplierId(
                  value === PICK_SUPPLIER || value == null ? "" : value
                )
              }
            >
              <SelectTrigger className="w-full" id="supplierId">
                <SelectValue placeholder="Select supplier">
                  {supplierId
                    ? suppliers.find((s) => s.id === supplierId)?.name
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PICK_SUPPLIER}>Select a supplier…</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus((value ?? "pending") as "pending" | "received")
              }
            >
              <SelectTrigger className="w-full" id="status">
                <SelectValue placeholder="Select shipment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedDate">Expected Date</Label>
            <Input
              id="expectedDate"
              type="date"
              value={expectedDate}
              onChange={(event) => setExpectedDate(event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="receivedDate">Received Date</Label>
            <Input
              id="receivedDate"
              type="date"
              value={receivedDate}
              onChange={(event) => setReceivedDate(event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional shipment notes"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Line Items</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`shipment-item-${index}`}
              className="grid gap-3 rounded-lg border p-3 md:grid-cols-[1fr_140px_160px_auto]"
            >
              <div className="space-y-2">
                <Label>Product</Label>
                <Select
                  value={item.productId || PICK_PRODUCT}
                  onValueChange={(value) =>
                    updateItem(index, {
                      productId:
                        value === PICK_PRODUCT || value == null ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select product">
                      {productLineLabel(products, item.productId)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PICK_PRODUCT}>Select a product…</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                        {product.sku ? ` (${product.sku})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={item.quantity}
                  onChange={(event) =>
                    updateItem(index, { quantity: Number(event.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Unit Cost</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.unitCost}
                  onChange={(event) =>
                    updateItem(index, { unitCost: Number(event.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex items-end justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  aria-label="Remove item"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-end border-t pt-3 text-sm font-medium">
            Total:{" "}
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
              totalCost
            )}
          </div>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/shipments")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : mode === "create" ? "Create Shipment" : "Update Shipment"}
        </Button>
      </div>
    </form>
  );
}
