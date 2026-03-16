# BloomOps

Florist inventory management system — manage products, suppliers, shipments, orders, and reports from a single dashboard.

Built with Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui, Prisma, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Auth | Auth.js v5 (NextAuth) |
| Charts | Recharts |
| Notifications | Sonner |
| Validation | Zod |

---

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL running locally

### 1. Clone and install

```bash
git clone <repo-url>
cd bloomops
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
DATABASE_URL="postgresql://<user>@localhost:5432/bloomops?schema=public"
DIRECT_URL="postgresql://<user>@localhost:5432/bloomops?schema=public"
AUTH_SECRET="any-random-string-for-local-dev"
```

> `AUTH_URL` is not required locally — Auth.js auto-detects it.

To generate a proper `AUTH_SECRET`:
```bash
npx auth secret
```

### 3. Create the database

```bash
createdb bloomops
```

### 4. Push schema and generate Prisma client

```bash
npm run db:push
```

> This syncs the schema to your local database without creating migration files. For production, see [DEPLOYMENT.md](DEPLOYMENT.md).

### 5. Seed sample data (optional)

```bash
npm run db:seed
```

Inserts sample suppliers, products, shipments, and orders for a florist inventory scenario.

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

### Demo login

| Field | Value |
|-------|-------|
| Email | `admin@bloomops.com` |
| Password | `admin123` |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3002 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:push` | Sync schema to local DB (no migration files) |
| `npm run db:migrate` | Create a new migration (dev only) |
| `npm run db:migrate:deploy` | Apply pending migrations (production) |
| `npm run db:seed` | Seed sample florist data |
| `npm run db:studio` | Open Prisma Studio |

---

## Project Structure

```
app/
├── (dashboard)/          # Protected routes (require login)
│   ├── dashboard/        # KPI cards and charts
│   ├── products/         # Product list, create, edit, detail
│   ├── suppliers/        # Supplier list, create, edit, detail
│   ├── shipments/        # Shipment tracking
│   ├── orders/           # Order management
│   ├── reports/          # Stock, sales, and profit reports
│   └── layout.tsx        # Sidebar + header layout
├── login/                # Public login page
├── api/auth/             # Auth.js route handlers
└── layout.tsx            # Root layout
components/
├── products/             # Product-specific components
├── suppliers/            # Supplier-specific components
├── ui/                   # shadcn/ui primitives
├── app-sidebar.tsx       # Main navigation sidebar
└── app-header.tsx        # Top navigation bar
lib/
├── actions/              # Server actions (CRUD, search)
├── validations/          # Zod schemas
├── format.ts             # Currency, date, number formatters
└── prisma.ts             # Prisma client singleton
prisma/
├── schema.prisma         # Database schema
├── migrations/           # Migration history (created before first deploy)
└── seed.ts               # Sample data seed script
```

---

## Deploying to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for a complete guide covering:

- Provisioning a hosted PostgreSQL database (Neon, Supabase, Railway, Render)
- Creating migration files before the first deploy
- Vercel project setup and required environment variables
- Running `prisma migrate deploy` against the production database
- Ongoing schema change workflow
- Known deployment risks (demo credentials, no rate limiting, etc.)
