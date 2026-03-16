"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/lib/validations/product";
import { Search, X } from "lucide-react";

export function ProductSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("category") ?? "all";
  const showArchived = searchParams.get("archived") === "true";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams, startTransition],
  );

  function clearFilters() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  const hasFilters = currentSearch || currentCategory !== "all" || showArchived;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or SKU..."
          defaultValue={currentSearch}
          onChange={(e) => updateParams("search", e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={currentCategory}
        onValueChange={(v) => updateParams("category", v ?? "all")}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {PRODUCT_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant={showArchived ? "secondary" : "outline"}
        size="sm"
        onClick={() =>
          updateParams("archived", showArchived ? "" : "true")
        }
      >
        {showArchived ? "Showing archived" : "Show archived"}
      </Button>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="size-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
