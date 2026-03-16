# BloomOps — Case Study

## Project Summary

BloomOps is a full-stack inventory management system built for small florist businesses. It covers the core operational loop: tracking products and stock levels, managing suppliers and incoming shipments, creating and fulfilling customer orders, and reviewing sales and profit performance through a reporting dashboard.

The project was built as a focused MVP — real pages, real data, real database — with a clean UI and a complete backend, rather than a throwaway prototype.

---

## Target User

A small florist business owner or shop manager who currently tracks inventory in spreadsheets or paper logs and needs a lightweight internal tool to manage stock, monitor what's low, place and track orders, and get a quick read on monthly performance.

---

## Problem It Solves

Florists deal with perishable, fast-moving inventory across multiple suppliers. Without dedicated tooling, common problems include:

- Not knowing current stock levels until something runs out
- No visibility into which products are most profitable
- Manual reconciliation of supplier invoices and shipment records
- No easy way to track customer orders from draft to delivery

BloomOps centralises these workflows in a single interface with a shared PostgreSQL backend.

---

## Core Features

**Products**
- Create, edit, and archive products with SKU, category, unit, cost and sell price, stock quantity, and minimum stock threshold
- Searchable and filterable product list with low-stock indicators
- Soft-delete (archive/restore) rather than hard delete

**Suppliers**
- Full CRUD for supplier records with contact details
- Detail page showing all active products linked to that supplier

**Shipments**
- Create incoming shipments from a supplier with line items
- Track shipment status (pending → received)
- Receiving a shipment updates product stock quantities

**Orders**
- Create customer orders with line items, delivery date, and customer contact
- Order status lifecycle: draft → confirmed → fulfilled → cancelled
- Total amount calculated automatically from line item prices
- Cost snapshots captured at order time for accurate profit calculation

**Dashboard**
- KPI cards: active products, suppliers, low-stock count, total stock units, estimated stock value, orders this month, gross profit this month
- Monthly sales and gross profit bar charts (12-month rolling window)
- Recent shipments and recent orders tables with quick links

**Reports**
- Stock value breakdown by category
- Low-stock products list with supplier attribution
- Top-selling products by quantity and revenue (last 12 months)
- Monthly sales and gross profit tables

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Component library | shadcn/ui (Base UI primitives) |
| ORM | Prisma 5 |
| Database | PostgreSQL (Neon serverless) |
| Auth | Auth.js v5 (NextAuth) — credentials provider, JWT sessions |
| Charts | Recharts |
| Validation | Zod v4 |
| Notifications | Sonner |

---

## Architecture Overview

```
Browser
  └── Next.js App Router (Next.js 16)
        ├── app/(dashboard)/         Protected routes — server components
        │     ├── dashboard/         Aggregated KPIs + charts
        │     ├── products/          CRUD + search/filter
        │     ├── suppliers/         CRUD + product listing
        │     ├── shipments/         Create + receive + status
        │     ├── orders/            Create + lifecycle management
        │     └── reports/           Stock, sales, profit reports
        ├── app/login/               Public auth page
        └── app/api/auth/            Auth.js route handlers

lib/
  ├── actions/         Server Actions — data fetching + mutations
  ├── validations/     Zod schemas (product, supplier, shipment, order)
  └── prisma.ts        PrismaClient singleton

prisma/
  └── schema.prisma    PostgreSQL schema (11 models)
```

Route protection uses Next.js 16's `proxy.ts` (equivalent of `middleware.ts`), which runs the Auth.js `authorized` callback on every protected path before the page renders.

Form mutations use React's `useActionState` hook wired to Server Actions — no separate API routes for create/update/delete. API routes exist only for order and shipment operations that are called programmatically (status transitions).

---

## Key Implementation Challenges

**Prisma Decimal serialization across the server/client boundary**

Prisma maps `DECIMAL` columns to its own `Decimal` class. Next.js requires plain serialisable values when passing props from Server Components to Client Components. Passing raw Prisma objects directly caused runtime errors. The fix was to explicitly pick and convert fields at the boundary — converting `Decimal` to `number` — rather than spreading Prisma objects as props.

**Base UI component nesting requirements**

The shadcn/ui components in this project are built on Base UI primitives rather than Radix. Base UI enforces stricter context requirements: `GroupLabel` must be a direct child of `Group`, not a free-floating child of the popup. This caused a silent context error in the header dropdown that was not caught at build time, only at runtime.

**Connection pooling in serverless**

Vercel's serverless functions can open a new database connection per invocation. Neon provides separate pooled and direct connection URLs; Prisma needs `directUrl` for migrations and `url` for runtime queries. Configuring both in `schema.prisma` and the environment correctly required understanding how PgBouncer interacts with Prisma's prepared statements.

**Profit calculation accuracy**

Gross profit cannot be calculated from current product prices because prices change over time. Orders capture `unitCostSnapshot` at the moment the order is created, so the reports and dashboard profit figures reflect what was actually paid, not today's cost.

---

## What I Learned Building It

- How Next.js App Router's server/client component boundary works in practice, and where it creates real friction (serialization, data fetching patterns, `"use server"` placement)
- How Auth.js v5 differs from v4 — `proxy.ts` vs `middleware.ts`, the `authorized` callback model, and why `trustHost: true` is needed in production
- The difference between `prisma db push` (for prototyping) and `prisma migrate dev` / `prisma migrate deploy` (for production schema management)
- How Base UI's component model differs from Radix — more explicit context requirements, different prop APIs
- How to structure Zod validation for Server Actions with `useActionState`, and the API differences between Zod v3 and v4

---

## What I Would Improve in v2

**Authentication**
Replace the hardcoded demo credentials with proper password hashing (bcrypt) and a user management flow. The current setup is only suitable for a private internal tool.

**Role-based access**
The `User` model has a `role` field that is not enforced anywhere. A v2 would distinguish between admin and read-only roles.

**Rate limiting and brute-force protection**
No protection on the login endpoint. For a public deployment this needs rate limiting on `/api/auth/callback/credentials`.

**Mobile layout**
The sidebar and table layouts work on desktop. A mobile-first pass — bottom nav, card-based list views instead of tables — would make the tool usable from a phone in the shop.

**Real-time low-stock alerts**
A background job or webhook that sends a notification (email or Slack) when a product's stock drops below its minimum threshold.

**Shipment search and filtering**
The shipments list has no search. Adding supplier and status filtering would mirror the pattern already in place for products and orders.
