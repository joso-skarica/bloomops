# BloomOps — Deployment Guide

This guide covers deploying BloomOps to [Vercel](https://vercel.com) with a hosted PostgreSQL database. The same principles apply to other Node.js hosting platforms.

---

## Table of Contents

1. [Pre-deploy checklist](#1-pre-deploy-checklist)
2. [Provision a hosted PostgreSQL database](#2-provision-a-hosted-postgresql-database)
3. [Create migrations locally](#3-create-migrations-locally)
4. [Deploy to Vercel](#4-deploy-to-vercel)
5. [Set environment variables on Vercel](#5-set-environment-variables-on-vercel)
6. [Run migrations on the production database](#6-run-migrations-on-the-production-database)
7. [Seed production data (optional)](#7-seed-production-data-optional)
8. [Ongoing schema change workflow](#8-ongoing-schema-change-workflow)
9. [Deployment risks and known limitations](#9-deployment-risks-and-known-limitations)

---

## 1. Pre-deploy checklist

- [ ] A hosted PostgreSQL database is provisioned (see step 2)
- [ ] `AUTH_SECRET` is generated (`npx auth secret`)
- [ ] Migrations exist in `prisma/migrations/` (see step 3)
- [ ] `.env` is **not** committed to git (`.gitignore` already excludes `env*`)
- [ ] The project builds locally without errors (`npm run build`)

---

## 2. Provision a hosted PostgreSQL database

Choose one of the following providers. All work with Prisma out of the box.

### Neon (recommended for Vercel)

Neon is serverless PostgreSQL with a generous free tier and native Vercel integration.

1. Create a project at [neon.tech](https://neon.tech).
2. From the **Connection Details** panel, copy two URLs:
   - **Pooled connection** (host ends in `-pooler.neon.tech`) → `DATABASE_URL`
   - **Direct connection** (host ends in `.neon.tech`, no `-pooler`) → `DIRECT_URL`
3. Append `?schema=public` to both URLs if not already present.

> Neon's pooled connection uses PgBouncer in transaction mode. Prisma requires the direct URL for migrations and schema introspection.

### Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → Database → Connection string**.
3. Copy the **URI** (direct, port 5432) → both `DATABASE_URL` and `DIRECT_URL`.
4. If you want pooling, use the **Session mode** pooler URL (port 6543) for `DATABASE_URL` and keep the direct URL for `DIRECT_URL`.

### Railway

1. Create a PostgreSQL service at [railway.app](https://railway.app).
2. From the service dashboard, copy the **DATABASE_URL**.
3. Set both `DATABASE_URL` and `DIRECT_URL` to the same value (Railway does not use a separate pooler URL).

### Render

1. Create a PostgreSQL instance at [render.com](https://render.com).
2. Copy the **External Database URL**.
3. Set both `DATABASE_URL` and `DIRECT_URL` to the same value.

---

## 3. Create migrations locally

The schema was initially set up with `prisma db push`, which does not produce migration files. Before deploying to production you must create an initial migration:

```bash
# In your local bloomops directory
npx prisma migrate dev --name init
```

This will:
- Create a `prisma/migrations/` folder with the initial SQL migration
- Apply the migration to your local database

Commit the `prisma/migrations/` folder to git — it must be present in the repo for `prisma migrate deploy` to work in production.

```bash
git add prisma/migrations/
git commit -m "add initial prisma migration"
```

---

## 4. Deploy to Vercel

### Option A — Vercel dashboard (recommended for first deploy)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Next.js** (auto-detected).
4. Leave the build command as-is (`next build`). The `postinstall` script in `package.json` ensures `prisma generate` runs automatically during `npm install`.
5. Click **Deploy** — the first deploy will fail because environment variables are not set yet. Continue to step 5.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## 5. Set environment variables on Vercel

In the Vercel dashboard go to **Project → Settings → Environment Variables** and add the following:

| Variable | Value | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | Pooled connection string from your provider | Production, Preview |
| `DIRECT_URL` | Direct connection string from your provider | Production, Preview |
| `AUTH_SECRET` | Output of `npx auth secret` | Production, Preview |
| `AUTH_URL` | `https://your-app.vercel.app` | Production |

> For Preview deployments, set `AUTH_URL` to the Vercel preview URL pattern, or leave it unset and rely on auto-detection (less reliable).

After adding all variables, trigger a new deployment from the Vercel dashboard (**Deployments → Redeploy**).

---

## 6. Run migrations on the production database

After the first successful deploy, apply the migrations to the production database.

### Option A — Vercel CLI (one-off command)

```bash
# From your local machine, targeting production env vars
vercel env pull .env.production.local
DATABASE_URL=$(grep DATABASE_URL .env.production.local | cut -d= -f2-) \
DIRECT_URL=$(grep DIRECT_URL .env.production.local | cut -d= -f2-) \
npx prisma migrate deploy
```

### Option B — Run locally with production DATABASE_URL

```bash
# Temporarily set your production URLs in a separate env file
DATABASE_URL="<production-direct-url>" DIRECT_URL="<production-direct-url>" \
npx prisma migrate deploy
```

> Always use the **direct** (non-pooled) URL when running `prisma migrate deploy` — migrations cannot run over PgBouncer.

### Option C — Vercel build command

You can change the Vercel build command to run migrations automatically before each deploy:

```
prisma migrate deploy && next build
```

Set this in **Project → Settings → General → Build Command**. Ensure `DIRECT_URL` is set to the direct connection string so migrations bypass the pooler.

---

## 7. Seed production data (optional)

If you want sample data in production, run the seed script with the production `DATABASE_URL`:

```bash
DATABASE_URL="<production-direct-url>" npx tsx prisma/seed.ts
```

This is safe to run once on an empty database. Do not run it repeatedly — the seed script does not check for existing data.

---

## 8. Ongoing schema change workflow

| Step | Command | Where |
|------|---------|-------|
| Edit `prisma/schema.prisma` | — | Local |
| Create a new migration | `npx prisma migrate dev --name <description>` | Local |
| Commit the migration file | `git add prisma/migrations/ && git commit` | Local |
| Push to main / open PR | `git push` | Local |
| Vercel redeploys automatically | — | Vercel |
| Apply migration to production DB | `npx prisma migrate deploy` (see step 6) | Local or CI |

---

## 9. Deployment risks and known limitations

### Demo credentials are hardcoded

`auth.ts` contains hardcoded credentials:

```
Email:    admin@bloomops.com
Password: admin123
```

Anyone who can reach the deployed URL can log in. For a production system used by real users, replace this with proper password hashing (bcrypt + database lookup) before making the URL public.

### No rate limiting on the login endpoint

There is no brute-force protection on `/api/auth/callback/credentials`. For a public deployment, add rate limiting via Vercel Edge Middleware or an upstream WAF.

### Serverless cold starts with Prisma

Vercel runs each serverless function in an isolated environment. Prisma's `PrismaClient` is instantiated on every cold start. For high-traffic applications consider:
- [Prisma Accelerate](https://www.prisma.io/accelerate) (connection pooling + query caching)
- Neon's built-in connection pooler (already handled by `DATABASE_URL` vs `DIRECT_URL` setup)

### `prisma db push` is not safe for production

`db push` was used to set up the local database. It drops and recreates constraints without a migration history, making it dangerous to run against a database with real data. Always use `prisma migrate deploy` for production.

### Auth.js v5 is still in beta

`next-auth@^5.0.0-beta.30` is a pre-release package. APIs may change before the stable release. Check the [Auth.js changelog](https://authjs.dev/getting-started/migrating-to-v5) before upgrading.

---

## Environment variables quick reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (pooled for Neon/Supabase) |
| `DIRECT_URL` | Yes | Direct PostgreSQL connection string (for migrations) |
| `AUTH_SECRET` | Yes | Random secret for JWT signing and encryption |
| `AUTH_URL` | Production only | Full deployment URL, e.g. `https://your-app.vercel.app` |
