"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface OrderStatusActionsProps {
  orderId: string;
  status: string;
}

const statusLabels: Record<string, string> = {
  confirmed: "confirmed",
  fulfilled: "fulfilled",
  cancelled: "cancelled",
};

export function OrderStatusActions({ orderId, status }: OrderStatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const updateStatus = (nextStatus: "confirmed" | "fulfilled" | "cancelled") => {
    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const msg = result.error ?? "Failed to update order status.";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success(`Order marked as ${statusLabels[nextStatus] ?? nextStatus}.`);
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {status === "draft" ? (
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => updateStatus("confirmed")}
          >
            Mark Confirmed
          </Button>
        ) : null}

        {(status === "draft" || status === "confirmed") ? (
          <Button
            disabled={isPending}
            onClick={() => updateStatus("fulfilled")}
          >
            Mark Fulfilled
          </Button>
        ) : null}

        {(status === "draft" || status === "confirmed") ? (
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => updateStatus("cancelled")}
          >
            Cancel Order
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
