import type { Prisma } from "@prisma/client";

const MAX_RETRIES = 10;

function getDatePrefix() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

export async function generateOrderNumber(tx: Prisma.TransactionClient) {
  const prefix = `ORD-${getDatePrefix()}`;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    const candidate = `${prefix}-${suffix}`;

    const existing = await tx.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new Error("Could not generate a unique order number");
}
