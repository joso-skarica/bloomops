"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
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

type ProductOption = {
  id: string;
  name: string;
  sku: string | null;
  sellPrice: number;
  stockQty: number;
};

type OrderLineItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

interface OrderFormProps {
  products: ProductOption[];
  mode: "create" | "edit";
  orderId?: string;
  initialValues?: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryDate: string;
    notes: string;
    status: "draft" | "confirmed";
    items: OrderLineItem[];
  };
}

export function OrderForm({ products, mode, orderId, initialValues }: OrderFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState(initialValues?.customerName ?? "");
  const [customerEmail, setCustomerEmail] = useState(initialValues?.customerEmail ?? "");
  const [customerPhone, setCustomerPhone] = useState(initialValues?.customerPhone ?? "");
  const [deliveryDate, setDeliveryDate] = useState(initialValues?.deliveryDate ?? "");
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [status, setStatus] = useState<"draft" | "confirmed">(
    initialValues?.status ?? "draft"
  );
  const [items, setItems] = useState<OrderLineItem[]>(
    initialValues?.items?.length
      ? initialValues.items
      : [{ productId: "", quantity: 1, unitPrice: 0 }]
  );

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const updateItem = (index: number, patch: Partial<OrderLineItem>) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const onProductChange = (index: number, productId: string | null) => {
    if (!productId) {
      updateItem(index, { productId: "" });
      return;
    }
    const product = products.find((entry) => entry.id === productId);
    updateItem(index, {
      productId,
      unitPrice: product?.sellPrice ?? 0,
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        deliveryDate,
        notes,
        status,
        items,
      };

      const endpoint = mode === "create" ? "/api/orders" : `/api/orders/${orderId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error ?? "Failed to save order.");
        return;
      }

      router.push(`/orders/${result.data.id}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus((value ?? "draft") as "draft" | "confirmed")}
            >
              <SelectTrigger className="w-full" id="status">
                <SelectValue placeholder="Select order status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Customer Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Customer Phone</Label>
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={deliveryDate}
              onChange={(event) => setDeliveryDate(event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional order notes"
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
              key={`order-item-${index}`}
              className="grid gap-3 rounded-lg border p-3 md:grid-cols-[1fr_140px_160px_auto]"
            >
              <div className="space-y-2">
                <Label>Product</Label>
                <Select
                  value={item.productId}
                  onValueChange={(value) => onProductChange(index, value)}
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
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(event) =>
                    updateItem(index, { unitPrice: Number(event.target.value) || 0 })
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
        <Button type="button" variant="outline" onClick={() => router.push("/orders")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : mode === "create" ? "Create Order" : "Update Order"}
        </Button>
      </div>
    </form>
  );
}
