# BloomOps Seed Plan

Sample data plan for florist inventory development and testing.

## Overview

The seed script (`prisma/seed.ts`) populates the database with:

| Entity    | Count | Description                                      |
| --------- | ----- | ------------------------------------------------ |
| Suppliers | 3     | Flower and plant wholesalers                     |
| Products  | 6     | Flowers, plants, and supplies                    |
| Shipments | 1     | Sample received shipment with line items         |
| Orders    | 1     | Sample fulfilled customer order                  |

## Data Details

### Suppliers

1. **Dutch Flower Co.** (Netherlands) - Premium roses and tulips
2. **Ecuador Blooms** (Ecuador) - Roses, carnations, tropical flowers
3. **Greenhouse Plants Ltd** (UK) - Potted plants, succulents, foliage

### Products

| SKU           | Name                         | Category  | Unit  | Cost  | Sell   |
| ------------- | ---------------------------- | --------- | ----- | ----- | ------ |
| ROSE-RED-001  | Red Roses (Dozen)             | flowers   | bunch | $8.50 | $24.99 |
| TULIP-MIX-002 | Mixed Tulips (10 stems)       | flowers   | bunch | $4.20 | $12.99 |
| ROSE-PINK-003 | Pink Roses (Dozen)            | flowers   | bunch | $9.00 | $26.99 |
| CARN-WHT-004  | White Carnations (20 stems)   | flowers   | bunch | $6.50 | $18.99 |
| SUCC-MIX-005  | Succulent Arrangement (Small) | plants    | each  | $12.00| $34.99 |
| VASE-CLEAR-006| Clear Glass Vase (Medium)     | supplies  | each  | $3.50 | $9.99  |

### Shipments

- 1 received shipment from Dutch Flower Co.
- Contains: 100 Red Roses, 50 Mixed Tulips

### Orders

- 1 fulfilled order (ORD-2025-001)
- Customer: Jane Smith
- 2x Red Roses @ $24.99 = $49.98

## Running the Seed

```bash
# Ensure database is set up
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push schema and run seed
npm run db:push
npm run db:seed
```

Or with migrations:

```bash
npm run db:migrate
npm run db:seed
```

## Extending the Seed

To add more sample data:

1. Add supplier/product/order entries to `prisma/seed.ts`
2. Use `upsert` for idempotent seeding (safe to run multiple times)
3. Maintain referential integrity (e.g., product.supplierId, orderItem.productId)
