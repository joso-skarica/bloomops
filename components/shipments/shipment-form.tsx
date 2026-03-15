"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type SupplierOption = {
  id: string;
  name: string;
};

type ProductOption = {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  stockQty: number;
};

type ShipmentLineItem = {
  productId: string;
  quantity: number;
  unitCost: number;
};

interface ShipmentFormProps {
  suppliers: SupplierOption[];
  products: ProductOption[];
}

export function ShipmentForm({ suppliers, products }: ShipmentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [supplierId, setSupplierId] = useState("");
  const [expectedAt, setExpectedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ShipmentLineItem[]>([
    { productId: "", quantity: 1, unitCost: 0 },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

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
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplierId,
          expectedAt,
          notes,
          items,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error ?? "Failed to create shipment.");
        return;
      }

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
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Select value={supplierId} onValueChange={(value) => setSupplierId(value ?? "")}>
              <SelectTrigger id="supplier" className="w-full">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedAt">Expected Date</Label>
            <Input
              id="expectedAt"
              type="date"
              value={expectedAt}
              onChange={(event) => setExpectedAt(event.target.value)}
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
                  value={item.productId}
                  onValueChange={(value) => updateItem(index, { productId: value ?? "" })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
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
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-end border-t pt-3 text-sm font-medium">
            Total: ${subtotal.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/shipments")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Shipment"}
        </Button>
      </div>
    </form>
  );
}
