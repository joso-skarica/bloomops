import { Decimal } from "@prisma/client/runtime/library";

export function formatCurrency(value: number | Decimal | string): string {
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function monthsAgo(n: number, from: Date = new Date()): Date {
  return new Date(from.getFullYear(), from.getMonth() - n, 1);
}
