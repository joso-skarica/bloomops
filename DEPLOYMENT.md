# BloomOps — Deployment Guide

BloomOps is deployed on [Railway](https://railway.app). This guide covers setting up a Railway deployment with a PostgreSQL database, either hosted on Railway itself or on an external provider such as Neon.

---

## Table of Contents

1. [Pre-deploy checklist](#1-pre-deploy-checklist)
2. [Provision a PostgreSQL database](#2-provision-a-postgresql-database)
3. [Create migrations locally](#3-create-migrations-locally)
4. [Deploy to Railway](#4-deploy-to-railway)
5. [Set environment variables](#5-set-environment-variables)
6. [Run migrations on the production database](#6-run-migrations-on-the-production-database)
7. [Seed production data (optional)](#7-seed-production-data-optional)
8. [Ongoing schema change workflow](#8-ongoing-schema-change-workflow)
9. [Deployment risks and known limitations](#9-deployment-risks-and-known-limitations)

---

## 1. Pre-deploy checklist

- [ ] A PostgreSQL database is provisioned (see step 2)
- [ ] `AUTH_SECRET` is generated (`npx auth secret`)
- [ ] Migrations exist in `prisma/migrations/` (see step 3)
- [ ] `.env` is **not** committed to git (`.gitignore` already excludes `env*`)
- [ ] The project builds locally without errors (`npm run build`)

---

## 2. Provision a PostgreSQL database

### Option A — Railway PostgreSQL (recommended, everything on one platform)

1. In your Railway project, click **New** → **Database** → **PostgreSQL**.
2. Once provisioned, open the PostgreSQL service → **Variables** tab.
3. Copy the `DATABASE_URL`. Use this value for both `DATABASE_URL` and `DIRECT_URL` — Railway does not use a separate pooler.

### Option B — Neon (external serverless PostgreSQL)

1. Create a project at [neon.tech](https://neon.tech).
2. From the **Connection Details** panel, copy two URLs:
   - **Pooled connection** (host ends in `-pooler.neon.tech`) → `DATABASE_URL`
   - **Direct connection** (no `-pooler`) → `DIRECT_URL`
3. Append `?schema=public` if not already present.

> With Neon, `DATABASE_URL` and `DIRECT_URL` are different. With Railway PostgreSQL, they are the same value.

---

## 3. Create migrations locally

The schema was initially set up with `prisma db push`, which does not produce migration files. Before deploying to production, create an initial migration:

```bash
npx prisma migrate dev --name init
```

Commit the generated `prisma/migrations/` folder:

```bash
git add prisma/migrations/
git commit -m "add initial prisma migration"
```

---

## 4. Deploy to Railway

A `railway.json` config file is already included in the repository. Railway will auto-detect Next.js and use it automatically.

### Option A — Railway dashboard

1. Go to [railway.app](https://railway.app) and create a new project.
2. Click **Deploy from GitHub repo** and select the BloomOps repository.
3. Railway detects Next.js and sets the build command to `npm run build` and start command to `npm start`.
4. The `postinstall` script in `package.json` runs `prisma generate` automatically during `npm install`.

### Option B — Railway CLI

```bash
npm install -g @railway/cli
railway login
railway link        # link to your Railway project
railway up          # deploy
```

---

## 5. Set environment variables

In the Railway dashboard, open your Next.js service → **Variables** tab and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | PostgreSQL connection string | Pooled URL for Neon; standard URL for Railway PostgreSQL |
| `DIRECT_URL` | Direct connection string | Same as `DATABASE_URL` for Railway PostgreSQL |
| `AUTH_SECRET` | Output of `npx auth secret` | Required in production |
| `AUTH_URL` | `https://bloomops-production.up.railway.app` | Your Railway app URL, no trailing slash |

After saving variables, Railway will trigger a new deployment automatically.

---

## 6. Run migrations on the production database

Use the **direct** (non-pooled) connection URL when running migrations.

### Option A — Run locally pointing at production database

```bash
DIRECT_URL="<production-direct-url>" DATABASE_URL="<production-direct-url>" \
npx prisma migrate deploy
```

### Option B — Railway CLI one-off command

```bash
railway run npx prisma migrate deploy
```

This uses the environment variables already set in Railway.

### Option C — Add to the Railway build command

In **Settings → Build Command**, replace the default with:

```
npx prisma migrate deploy && npm run build
```

This applies migrations automatically on every deploy.

---

## 7. Seed production data (optional)

```bash
railway run npx tsx prisma/seed.ts
```

Or locally with the production URL:

```bash
DATABASE_URL="<production-direct-url>" npx tsx prisma/seed.ts
```

Run once on an empty database only.

---

## 8. Ongoing schema change workflow

| Step | Command | Where |
|------|---------|-------|
| Edit `prisma/schema.prisma` | — | Local |
| Create a migration | `npx prisma migrate dev --name <description>` | Local |
| Commit the migration | `git add prisma/migrations/ && git commit` | Local |
| Push to main | `git push` | Local |
| Railway redeploys automatically | — | Railway |
| Apply migration to production DB | `railway run npx prisma migrate deploy` | Local or Railway CLI |

---

## 9. Deployment risks and known limitations

### Demo credentials are hardcoded

`auth.ts` contains hardcoded credentials:

```
Email:    admin@bloomops.com
Password: admin123
```

Anyone who can reach the deployed URL can log in. Replace with proper password hashing (bcrypt + database lookup) before making the URL public to untrusted users.

### No rate limiting on the login endpoint

There is no brute-force protection on `/api/auth/callback/credentials`. For a public deployment, add rate limiting via Railway's upstream proxy or a middleware layer.

### `prisma db push` is not safe for production

`db push` was used to set up the local database. It can drop and recreate constraints without a migration history. Always use `prisma migrate deploy` for production schema changes.

### Auth.js v5 is still in beta

`next-auth@^5.0.0-beta.30` is a pre-release package. Check the [Auth.js changelog](https://authjs.dev/getting-started/migrating-to-v5) before upgrading.

---

## Environment variables quick reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DIRECT_URL` | Yes | Direct connection string (for migrations; same as `DATABASE_URL` on Railway) |
| `AUTH_SECRET` | Yes | Random secret for JWT signing |
| `AUTH_URL` | Yes | Full deployment URL, e.g. `https://bloomops-production.up.railway.app` |
