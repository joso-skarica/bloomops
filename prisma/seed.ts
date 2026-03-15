/**
 * BloomOps Seed Plan - Florist Inventory Sample Data
 *
 * This seed creates sample data for development and testing.
 * Run with: npx prisma db seed
 *
 * SEED PLAN:
 * 1. Users - Demo admin user (for credentials auth, use seed to create DB user)
 * 2. Suppliers - 3-4 flower/plant wholesalers
 * 3. Products - Mix of flowers, plants, and supplies
 * 4. Shipments - 2-3 sample incoming shipments
 * 5. Orders - 2-3 sample customer orders
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding BloomOps database...");

  // 1. Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { id: "seed-supplier-1" },
      update: {},
      create: {
        id: "seed-supplier-1",
        name: "Dutch Flower Co.",
        contact: "Jan van der Berg",
        email: "orders@dutchflower.co",
        phone: "+31 20 123 4567",
        address: "Amsterdam, Netherlands",
        notes: "Premium roses and tulips",
      },
    }),
    prisma.supplier.upsert({
      where: { id: "seed-supplier-2" },
      update: {},
      create: {
        id: "seed-supplier-2",
        name: "Ecuador Blooms",
        contact: "Maria Garcia",
        email: "sales@ecuadorblooms.com",
        phone: "+593 2 234 5678",
        address: "Quito, Ecuador",
        notes: "Roses, carnations, tropical flowers",
      },
    }),
    prisma.supplier.upsert({
      where: { id: "seed-supplier-3" },
      update: {},
      create: {
        id: "seed-supplier-3",
        name: "Greenhouse Plants Ltd",
        contact: "Tom Wilson",
        email: "wholesale@greenhouseplants.com",
        phone: "+44 20 345 6789",
        address: "London, UK",
        notes: "Potted plants, succulents, foliage",
      },
    }),
  ]);

  console.log(`  ✓ Created ${suppliers.length} suppliers`);

  // 2. Products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: "ROSE-RED-001" },
      update: {},
      create: {
        name: "Red Roses (Dozen)",
        sku: "ROSE-RED-001",
        category: "flowers",
        unit: "bunch",
        costPrice: 8.5,
        sellPrice: 24.99,
        stockQty: 50,
        minStock: 10,
        supplierId: suppliers[0].id,
        description: "Premium long-stem red roses",
      },
    }),
    prisma.product.upsert({
      where: { sku: "TULIP-MIX-002" },
      update: {},
      create: {
        name: "Mixed Tulips (10 stems)",
        sku: "TULIP-MIX-002",
        category: "flowers",
        unit: "bunch",
        costPrice: 4.2,
        sellPrice: 12.99,
        stockQty: 80,
        minStock: 20,
        supplierId: suppliers[0].id,
        description: "Assorted color tulips",
      },
    }),
    prisma.product.upsert({
      where: { sku: "ROSE-PINK-003" },
      update: {},
      create: {
        name: "Pink Roses (Dozen)",
        sku: "ROSE-PINK-003",
        category: "flowers",
        unit: "bunch",
        costPrice: 9.0,
        sellPrice: 26.99,
        stockQty: 35,
        minStock: 10,
        supplierId: suppliers[1].id,
        description: "Ecuadorian pink roses",
      },
    }),
    prisma.product.upsert({
      where: { sku: "CARN-WHT-004" },
      update: {},
      create: {
        name: "White Carnations (20 stems)",
        sku: "CARN-WHT-004",
        category: "flowers",
        unit: "bunch",
        costPrice: 6.5,
        sellPrice: 18.99,
        stockQty: 60,
        minStock: 15,
        supplierId: suppliers[1].id,
        description: "Fresh white carnations",
      },
    }),
    prisma.product.upsert({
      where: { sku: "SUCC-MIX-005" },
      update: {},
      create: {
        name: "Succulent Arrangement (Small)",
        sku: "SUCC-MIX-005",
        category: "plants",
        unit: "each",
        costPrice: 12.0,
        sellPrice: 34.99,
        stockQty: 25,
        minStock: 5,
        supplierId: suppliers[2].id,
        description: "3-piece succulent arrangement in ceramic pot",
      },
    }),
    prisma.product.upsert({
      where: { sku: "VASE-CLEAR-006" },
      update: {},
      create: {
        name: "Clear Glass Vase (Medium)",
        sku: "VASE-CLEAR-006",
        category: "supplies",
        unit: "each",
        costPrice: 3.5,
        sellPrice: 9.99,
        stockQty: 100,
        minStock: 20,
        description: "Classic cylindrical glass vase",
      },
    }),
  ]);

  console.log(`  ✓ Created ${products.length} products`);

  // 3. Shipments
  const shipment = await prisma.shipment.upsert({
    where: { id: "seed-shipment-1" },
    update: {},
    create: {
      id: "seed-shipment-1",
      supplierId: suppliers[0].id,
      status: "received",
      expectedAt: new Date("2025-03-10"),
      receivedAt: new Date("2025-03-10"),
      notes: "Weekly rose delivery",
    },
  });

  await prisma.shipmentItem.createMany({
    data: [
      {
        shipmentId: shipment.id,
        productId: products[0].id,
        quantity: 100,
        unitCost: 8.5,
      },
      {
        shipmentId: shipment.id,
        productId: products[1].id,
        quantity: 50,
        unitCost: 4.2,
      },
    ],
    skipDuplicates: true,
  });

  console.log("  ✓ Created 1 shipment with items");

  // 4. Orders
  const order = await prisma.order.upsert({
    where: { orderNumber: "ORD-2025-001" },
    update: {},
    create: {
      orderNumber: "ORD-2025-001",
      status: "fulfilled",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "+1 555 123 4567",
      deliveryDate: new Date("2025-03-14"),
      notes: "Birthday bouquet",
      totalAmount: 49.98,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        productId: products[0].id,
        quantity: 2,
        unitPrice: 24.99,
      },
    ],
    skipDuplicates: true,
  });

  console.log("  ✓ Created 1 sample order");

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
