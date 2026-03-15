# BloomOps — Project Notes

## MVP Status

### Implemented

- **Authentication:** Demo credentials login via NextAuth.js (Credentials provider, JWT sessions). Route protection via Next.js 16 `proxy.ts`.
- **Dashboard:** KPI cards (products, suppliers, low stock, stock value, orders, profit), monthly sales and gross profit bar charts (Recharts), recent shipments and orders tables.
- **Shipments:** List, create, and detail pages. Creating a shipment increases `stockQty` for each product and writes `StockHistory` entries. All operations are transactional.
- **Orders:** List, create, edit, and detail pages. Orders start as draft or confirmed. Fulfillment validates stock availability, decrements `stockQty`, and writes `StockHistory` entries. Fulfilled orders cannot be cancelled. `unitCostSnapshot` is captured at order creation time.
- **Reports:** Stock value by category, low-stock products table, top-selling products, monthly sales totals, monthly gross profit totals.
- **UI polish:** Loading skeleton (`loading.tsx`), error boundary (`error.tsx`), toast notifications (sonner), login error handling, sidebar active state for nested routes, aria-labels on interactive elements.

### Placeholder (not yet implemented)

- **Products page:** Stub only — no CRUD, no inline editing.
- **Suppliers page:** Stub only — no CRUD.

### Known Limitations

- **Demo auth only:** Single hardcoded user (`admin@bloomops.com` / `admin123`). No registration, password hashing, or multi-user support.
- **No image uploads:** Products have no image field.
- **No pagination:** List pages load all records. Acceptable for MVP scale but will need pagination for production.
- **No search or filtering:** List pages show all records without search bars or filters.
- **No CSV/PDF export:** Reports are view-only.
- **Client-side form validation:** Forms rely on server-side Zod validation via API routes. No inline field-level validation before submission.
- **Stock history is write-only:** `StockHistory` entries are created but not surfaced in any UI yet.

## Architecture Decisions

- **Server components for data fetching:** All list and detail pages are async server components that query Prisma directly. No client-side data fetching library needed.
- **Client components for interactivity:** Forms, charts, and status action buttons are `"use client"` components that call API routes via `fetch`.
- **API routes as thin wrappers:** `/api/shipments`, `/api/orders`, etc. parse JSON and delegate to `lib/actions/` functions. This keeps business logic testable and reusable.
- **Prisma transactions for stock:** Shipment creation and order fulfillment use `prisma.$transaction()` to ensure atomicity of stock updates and history writes.
- **`force-dynamic` on data pages:** Pages that query the database use `export const dynamic = "force-dynamic"` to prevent stale static renders.
- **Shared formatting helpers:** `lib/format.ts` provides `formatCurrency`, `formatNumber`, `formatDate`, and `formatMonth` used across dashboard, reports, and list pages.
