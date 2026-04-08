"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createProduct,
  updateProduct,
  type ActionResult,
} from "@/lib/actions/products";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
} from "@/lib/validations/product";
import Link from "next/link";

const NO_SUPPLIER = "__none__";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    sku: string | null;
    category: string;
    unit: string;
    costPrice: number;
    sellPrice: number;
    stockQty: number;
    minStock: number;
    supplierId: string | null;
    description: string | null;
  };
  suppliers: Array<{ id: string; name: string }>;
}

export function ProductForm({ product, suppliers }: ProductFormProps) {
  const isEditing = !!product;

  const action = isEditing
    ? updateProduct.bind(null, product.id)
    : createProduct;

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  const [category, setCategory] = useState(product?.category ?? "flowers");
  const [unit, setUnit] = useState(product?.unit ?? "each");
  const [supplierId, setSupplierId] = useState(product?.supplierId ?? "");

  const supplierSelectValue = supplierId || NO_SUPPLIER;

  return (
    <form action={formAction}>
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="unit" value={unit} />
      <input type="hidden" name="supplierId" value={supplierId} />

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Product" : "New Product"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name ?? ""}
                placeholder="Red Roses (Dozen)"
              />
              {state?.errors?.name && (
                <p className="text-sm text-destructive">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                defaultValue={product?.sku ?? ""}
                placeholder="ROSE-RED-001"
              />
              {state?.errors?.sku && (
                <p className="text-sm text-destructive">
                  {state.errors.sku[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v ?? "flowers")}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.category && (
                <p className="text-sm text-destructive">
                  {state.errors.category[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={unit}
                onValueChange={(v) => setUnit(v ?? "each")}
              >
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u.charAt(0).toUpperCase() + u.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.unit && (
                <p className="text-sm text-destructive">
                  {state.errors.unit[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">
                Cost Price ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product ? Number(product.costPrice) : ""}
                placeholder="0.00"
              />
              {state?.errors?.costPrice && (
                <p className="text-sm text-destructive">
                  {state.errors.costPrice[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellPrice">
                Sell Price ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sellPrice"
                name="sellPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product ? Number(product.sellPrice) : ""}
                placeholder="0.00"
              />
              {state?.errors?.sellPrice && (
                <p className="text-sm text-destructive">
                  {state.errors.sellPrice[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQty">Stock Qty</Label>
              <Input
                id="stockQty"
                name="stockQty"
                type="number"
                min="0"
                defaultValue={product?.stockQty ?? 0}
                placeholder="0"
              />
              {state?.errors?.stockQty && (
                <p className="text-sm text-destructive">
                  {state.errors.stockQty[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">Min Stock Alert</Label>
              <Input
                id="minStock"
                name="minStock"
                type="number"
                min="0"
                defaultValue={product?.minStock ?? 0}
                placeholder="0"
              />
              {state?.errors?.minStock && (
                <p className="text-sm text-destructive">
                  {state.errors.minStock[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <Select
              value={supplierSelectValue}
              onValueChange={(v) =>
                setSupplierId(v === NO_SUPPLIER || v == null ? "" : v)
              }
            >
              <SelectTrigger id="supplierId" className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_SUPPLIER}>None</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.supplierId && (
              <p className="text-sm text-destructive">
                {state.errors.supplierId[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description ?? ""}
              placeholder="Product description"
              rows={3}
            />
            {state?.errors?.description && (
              <p className="text-sm text-destructive">
                {state.errors.description[0]}
              </p>
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
                  ? "Update Product"
                  : "Create Product"}
            </Button>
            <Link href="/products">
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

