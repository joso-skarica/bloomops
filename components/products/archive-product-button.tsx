"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { archiveProduct, restoreProduct } from "@/lib/actions/products";
import { Archive, ArchiveRestore } from "lucide-react";

export function ArchiveProductButton({
  id,
  name,
  isActive,
  redirectOnArchive,
}: {
  id: string;
  name: string;
  isActive: boolean;
  redirectOnArchive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAction() {
    startTransition(async () => {
      if (isActive) {
        await archiveProduct(id);
        setOpen(false);
        if (redirectOnArchive) router.push("/products");
        else router.refresh();
      } else {
        await restoreProduct(id);
        setOpen(false);
        router.refresh();
      }
    });
  }

  if (!isActive) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleAction}
        disabled={isPending}
      >
        <ArchiveRestore className="size-4" />
        {isPending ? "Restoring..." : "Restore"}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive">
            <Archive className="size-4" />
            Archive
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive product</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive <strong>{name}</strong>? It will be
            hidden from product lists and cannot be added to new orders. This can
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleAction}
            disabled={isPending}
          >
            {isPending ? "Archiving..." : "Archive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
