# BloomOps

Florist inventory management system built with Next.js, TypeScript, Tailwind, shadcn/ui, Prisma, and PostgreSQL.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Prisma** + **PostgreSQL**
- **NextAuth.js** (Auth.js v5)
- **Recharts** (dashboard charts)
- **Sonner** (toast notifications)

## Getting Started

### 1. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection string and generate an auth secret:

```bash
openssl rand -base64 32
```

Add the generated value as `AUTH_SECRET` in `.env`.

### 2. Database Setup

```bash
npm run db:push    # Push schema to database
npm run db:seed    # Seed sample florist data (optional)
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

### Demo Login

- **Email:** admin@bloomops.com
- **Password:** admin123

## Project Structure

```
app/
├── (dashboard)/              # Protected dashboard routes
│   ├── dashboard/            # KPI cards, charts, recent activity
│   ├── products/             # Product list (placeholder)
│   ├── suppliers/            # Supplier list (placeholder)
│   ├── shipments/            # List, create, detail pages
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── orders/               # List, create, detail, edit pages
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   ├── [id]/page.tsx
│   │   └── [id]/edit/page.tsx
│   ├── reports/              # Stock, sales, profit reports
│   ├── loading.tsx           # Shared loading skeleton
│   ├── error.tsx             # Shared error boundary
│   └── layout.tsx            # Sidebar + header layout
├── login/
├── api/
│   ├── auth/[...nextauth]/
│   ├── shipments/
│   └── orders/
└── layout.tsx                # Root layout with Toaster
components/
├── app-sidebar.tsx
├── app-header.tsx
├── dashboard/
│   └── monthly-chart.tsx     # Recharts bar chart
├── shipments/
│   └── shipment-form.tsx
├── orders/
│   ├── order-form.tsx
│   └── order-status-actions.tsx
└── ui/                       # shadcn components
lib/
├── actions/
│   ├── dashboard.ts          # Dashboard queries
│   ├── reports.ts            # Reports queries
│   ├── shipments.ts          # Shipment CRUD + stock logic
│   └── orders.ts             # Order CRUD + fulfillment logic
├── validations/
│   ├── shipment.ts           # Zod schemas
│   └── order.ts
├── format.ts                 # Currency, date, number formatters
├── order-number.ts           # Order number generation
├── prisma.ts
└── utils.ts
prisma/
├── schema.prisma
└── seed.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3002) |
| `npm run build` | Production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema (no migrations) |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## Seed Plan

See [docs/SEED_PLAN.md](docs/SEED_PLAN.md) for florist inventory sample data details.

## Project Notes

See [docs/PROJECT_NOTES.md](docs/PROJECT_NOTES.md) for MVP status, known limitations, and architecture decisions.
