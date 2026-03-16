# BloomOps

Inventory and operations management for small florist businesses.

BloomOps lets you track products and stock levels, manage suppliers and incoming shipments, create and fulfil customer orders, and monitor sales and profit performance — all from a single dashboard backed by a live PostgreSQL database.

**Live demo:** [bloomops.vercel.app](https://bloomops.vercel.app) &nbsp;·&nbsp; `admin@bloomops.com` / `admin123`

---

## Features

**Dashboard** — KPI cards (active products, suppliers, low-stock count, stock value, orders and gross profit for the current month) plus rolling 12-month sales and profit charts.

**Products** — Create, edit, and archive products with SKU, category, unit, cost price, sell price, stock quantity, and minimum stock threshold. Searchable and filterable list with low-stock indicators.

**Suppliers** — Full supplier records with contact details. Detail page lists all active products linked to that supplier.

**Shipments** — Log incoming shipments from a supplier with line items and expected delivery. Track status from pending to received.

**Orders** — Customer orders with line items, delivery date, and contact info. Status lifecycle: draft → confirmed → fulfilled → cancelled. Cost is snapshotted at order time for accurate profit reporting.

**Reports** — Stock value by category, low-stock product list, top-selling products (last 12 months), monthly sales and gross profit tables.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Base UI primitives) |
| ORM | Prisma 5 |
| Database | PostgreSQL (Neon) |
| Auth | Auth.js v5 — credentials provider, JWT sessions |
| Charts | Recharts |
| Validation | Zod v4 |
| Notifications | Sonner |

---

## Screenshots

> Add screenshots here after first deploy.

| Dashboard | Products | Orders |
|-----------|----------|--------|
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a [Neon](https://neon.tech) project)

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/bloomops.git
cd bloomops
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# For local PostgreSQL
DATABASE_URL="postgresql://<user>@localhost:5432/bloomops?schema=public"
DIRECT_URL="postgresql://<user>@localhost:5432/bloomops?schema=public"

# Generate with: npx auth secret
AUTH_SECRET="your-secret-here"
```

`AUTH_URL` is not required locally — Auth.js auto-detects it.

### 3. Set up the database

```bash
createdb bloomops      # create local database
npm run db:push        # sync schema (no migration files)
npm run db:seed        # optional: load sample florist data
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) and log in with `admin@bloomops.com` / `admin123`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3002 |
| `npm run build` | Production build |
| `npm run db:push` | Sync schema to local DB |
| `npm run db:migrate` | Create a migration (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed sample florist data |
| `npm run db:studio` | Open Prisma Studio |

---

## Deployment

BloomOps deploys to Vercel with a Neon PostgreSQL database. The `postinstall` script runs `prisma generate` automatically during Vercel's build.

Required environment variables on Vercel:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_URL` | Neon direct connection string (for migrations) |
| `AUTH_SECRET` | Random secret — generate with `npx auth secret` |
| `AUTH_URL` | Your Vercel deployment URL |

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full step-by-step guide including migration setup, provider-specific URL formats, and known production risks.

---

## Project Structure

```
app/
├── (dashboard)/          # Protected routes (require login)
│   ├── dashboard/        # KPI cards and charts
│   ├── products/         # List, create, edit, detail
│   ├── suppliers/        # List, create, edit, detail
│   ├── shipments/        # List, create, detail
│   ├── orders/           # List, create, edit, detail
│   └── reports/          # Stock, sales, and profit reports
├── api/                  # Route handlers (auth, orders, shipments)
└── login/                # Public login page
components/
├── products/             # Product form, search, archive button
├── suppliers/            # Supplier form, archive button
├── orders/               # Order form, status actions
├── shipments/            # Shipment form
├── dashboard/            # Monthly chart
└── ui/                   # shadcn/ui primitives
lib/
├── actions/              # Server actions — all data fetching and mutations
├── validations/          # Zod schemas
├── format.ts             # Currency, date, number formatters
└── prisma.ts             # PrismaClient singleton
prisma/
├── schema.prisma         # 11-model PostgreSQL schema
└── seed.ts               # Sample data seed
```

---

## Notes

- Authentication uses hardcoded demo credentials. Suitable for a private internal tool; not intended for public multi-user production use without replacing the auth layer.
- See [CASE_STUDY.md](CASE_STUDY.md) for a detailed write-up of implementation decisions, challenges, and planned v2 improvements.
