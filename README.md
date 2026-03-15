# BloomOps

Florist inventory management system built with Next.js, TypeScript, Tailwind, shadcn/ui, Prisma, and PostgreSQL.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Prisma** + **PostgreSQL**
- **NextAuth.js** (Auth.js v5)

## Getting Started

### 1. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection string and generate an auth secret:

```bash
npx auth secret
```

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
├── (dashboard)/          # Protected dashboard routes
│   ├── dashboard/
│   ├── products/
│   ├── suppliers/
│   ├── shipments/
│   ├── orders/
│   └── reports/
├── login/
└── api/auth/[...nextauth]/
components/
├── app-sidebar.tsx
├── app-header.tsx
└── ui/                   # shadcn components
lib/
├── prisma.ts
└── utils.ts
prisma/
├── schema.prisma
└── seed.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema (no migrations) |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## Seed Plan

See [docs/SEED_PLAN.md](docs/SEED_PLAN.md) for florist inventory sample data details.
