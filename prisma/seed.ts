/**
 * BloomOps — Demo Seed Data
 *
 * Creates a compact, realistic florist operations demo dataset.
 * Run with: npm run db:seed
 *
 * Data set:
 *   4 suppliers  — flowers, greenery, packaging, studio supplies
 *   9 products   — flowers, greenery, wrapping supplies, accessories
 *   2 shipments  — one flower delivery, one packaging delivery
 *   3 orders     — fulfilled, confirmed, and draft states
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BloomOps database...");

  // ─── Suppliers ───────────────────────────────────────────────────────────

  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { id: "seed-supplier-1" },
      update: {},
      create: {
        id: "seed-supplier-1",
        name: "Dalmatia Flowers Supply",
        contact: "Luka Horvat",
        email: "orders@dalmatiaflowers.hr",
        phone: "+385 21 555 0101",
        address: "Marmontova 12, 21000 Split, Croatia",
        notes: "Primary supplier for roses, tulips, and seasonal cut flowers.",
      },
    }),
    prisma.supplier.upsert({
      where: { id: "seed-supplier-2" },
      update: {},
      create: {
        id: "seed-supplier-2",
        name: "Adriatic Floral Wholesale",
        contact: "Maja Blažević",
        email: "wholesale@adriaticfloral.com",
        phone: "+385 51 555 0202",
        address: "Korzo 8, 51000 Rijeka, Croatia",
        notes: "Greenery, eucalyptus, seasonal mixed bouquets.",
      },
    }),
    prisma.supplier.upsert({
      where: { id: "seed-supplier-3" },
      update: {},
      create: {
        id: "seed-supplier-3",
        name: "Mediteran Packaging",
        contact: "Ivan Perić",
        email: "sales@mediteranpkg.com",
        phone: "+385 1 555 0303",
        address: "Ilica 44, 10000 Zagreb, Croatia",
        notes: "Kraft paper, ribbon, greeting cards, and wrapping supplies.",
      },
    }),
    prisma.supplier.upsert({
      where: { id: "seed-supplier-4" },
      update: {},
      create: {
        id: "seed-supplier-4",
        name: "Flora Studio Partners",
        contact: "Ana Kovačević",
        email: "info@florastudiopartners.com",
        phone: "+385 20 555 0404",
        address: "Stradun 3, 20000 Dubrovnik, Croatia",
        notes: "Vases, floral foam, decorative accessories.",
      },
    }),
  ]);

  console.log(`  Created ${suppliers.length} suppliers`);

  const [dalmatia, adriatic, mediteran, floraStudio] = suppliers;

  // ─── Products ────────────────────────────────────────────────────────────

  const products = await Promise.all([
    // Flowers
    prisma.product.upsert({
      where: { sku: "ROSE-RED-001" },
      update: {},
      create: {
        name: "Red Roses",
        sku: "ROSE-RED-001",
        category: "flowers",
        unit: "bunch",
        costPrice: 8.50,
        sellPrice: 24.99,
        stockQty: 60,
        minStock: 15,
        supplierId: dalmatia.id,
        description: "Dozen long-stem red roses. Order cut fresh weekly.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "TULIP-WHT-002" },
      update: {},
      create: {
        name: "White Tulips",
        sku: "TULIP-WHT-002",
        category: "flowers",
        unit: "bunch",
        costPrice: 4.50,
        sellPrice: 13.99,
        stockQty: 80,
        minStock: 20,
        supplierId: dalmatia.id,
        description: "10 stems of white Dutch tulips.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "EUCAL-003" },
      update: {},
      create: {
        name: "Eucalyptus Stems",
        sku: "EUCAL-003",
        category: "flowers",
        unit: "bunch",
        costPrice: 2.80,
        sellPrice: 8.99,
        stockQty: 120,
        minStock: 30,
        supplierId: adriatic.id,
        description: "5 fresh eucalyptus stems. Used as filler in arrangements.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "BOUQ-SEA-004" },
      update: {},
      create: {
        name: "Mixed Seasonal Bouquet",
        sku: "BOUQ-SEA-004",
        category: "flowers",
        unit: "each",
        costPrice: 15.00,
        sellPrice: 42.00,
        stockQty: 18,
        minStock: 5,
        supplierId: adriatic.id,
        description: "Pre-arranged mixed bouquet using whatever is in season.",
      },
    }),

    // Supplies
    prisma.product.upsert({
      where: { sku: "RIB-SAT-005" },
      update: {},
      create: {
        name: "Satin Ribbon",
        sku: "RIB-SAT-005",
        category: "supplies",
        unit: "each",
        costPrice: 1.20,
        sellPrice: 3.99,
        stockQty: 200,
        minStock: 50,
        supplierId: mediteran.id,
        description: "5 m roll. Available in ivory, blush, and forest green.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "WRAP-KFT-006" },
      update: {},
      create: {
        name: "Kraft Wrapping Paper",
        sku: "WRAP-KFT-006",
        category: "supplies",
        unit: "each",
        costPrice: 0.30,
        sellPrice: 0.99,
        stockQty: 500,
        minStock: 100,
        supplierId: mediteran.id,
        description: "Single A2 sheet. Sold per sheet at counter.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "CARD-BLK-007" },
      update: {},
      create: {
        name: "Greeting Card",
        sku: "CARD-BLK-007",
        category: "supplies",
        unit: "each",
        costPrice: 0.50,
        sellPrice: 2.49,
        stockQty: 3,
        minStock: 20,
        supplierId: mediteran.id,
        description: "Blank inside. Mix of floral and neutral designs.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "VASE-CLR-008" },
      update: {},
      create: {
        name: "Glass Vase",
        sku: "VASE-CLR-008",
        category: "supplies",
        unit: "each",
        costPrice: 3.50,
        sellPrice: 9.99,
        stockQty: 45,
        minStock: 15,
        supplierId: floraStudio.id,
        description: "Clear cylindrical vase, 20 cm tall. Fits a standard dozen bouquet.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "FOAM-BLK-009" },
      update: {},
      create: {
        name: "Floral Foam Block",
        sku: "FOAM-BLK-009",
        category: "supplies",
        unit: "each",
        costPrice: 0.90,
        sellPrice: 2.99,
        stockQty: 150,
        minStock: 40,
        supplierId: floraStudio.id,
        description: "Standard brick. Soakable. Used for structured arrangements.",
      },
    }),
  ]);

  console.log(`  Created ${products.length} products`);

  const [redRoses, whiteTulips, eucalyptus, mixedBouquet, ribbon, kraftPaper, greetingCard, glassVase, floralFoam] = products;

  // ─── Shipments ───────────────────────────────────────────────────────────

  const shipment1 = await prisma.shipment.upsert({
    where: { id: "seed-shipment-1" },
    update: {},
    create: {
      id: "seed-shipment-1",
      supplierId: dalmatia.id,
      status: "received",
      expectedAt: new Date("2025-06-02"),
      receivedAt: new Date("2025-06-02"),
      notes: "Weekly cut flower delivery.",
    },
  });

  await prisma.shipmentItem.createMany({
    data: [
      { shipmentId: shipment1.id, productId: redRoses.id,    quantity: 80,  unitCost: 8.50 },
      { shipmentId: shipment1.id, productId: whiteTulips.id, quantity: 100, unitCost: 4.50 },
      { shipmentId: shipment1.id, productId: eucalyptus.id,  quantity: 150, unitCost: 2.80 },
    ],
    skipDuplicates: true,
  });

  const shipment2 = await prisma.shipment.upsert({
    where: { id: "seed-shipment-2" },
    update: {},
    create: {
      id: "seed-shipment-2",
      supplierId: mediteran.id,
      status: "received",
      expectedAt: new Date("2025-06-05"),
      receivedAt: new Date("2025-06-05"),
      notes: "Monthly packaging restock.",
    },
  });

  await prisma.shipmentItem.createMany({
    data: [
      { shipmentId: shipment2.id, productId: ribbon.id,      quantity: 100, unitCost: 1.20 },
      { shipmentId: shipment2.id, productId: kraftPaper.id,  quantity: 300, unitCost: 0.30 },
      { shipmentId: shipment2.id, productId: greetingCard.id,quantity: 100, unitCost: 0.50 },
    ],
    skipDuplicates: true,
  });

  console.log("  Created 2 shipments with items");

  // ─── Orders ──────────────────────────────────────────────────────────────

  // Order 1 — fulfilled
  const order1 = await prisma.order.upsert({
    where: { orderNumber: "ORD-2025-001" },
    update: {},
    create: {
      orderNumber: "ORD-2025-001",
      status: "fulfilled",
      customerName: "Ana Kovač",
      customerEmail: "ana.kovac@example.com",
      customerPhone: "+385 98 123 4567",
      deliveryDate: new Date("2025-06-07"),
      notes: "Wedding anniversary. Requested red and white colour scheme.",
      totalAmount: 61.97,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, productId: redRoses.id,    quantity: 2, unitPrice: 24.99, unitCostSnapshot: 8.50 },
      { orderId: order1.id, productId: glassVase.id,   quantity: 1, unitPrice: 9.99,  unitCostSnapshot: 3.50 },
      { orderId: order1.id, productId: greetingCard.id,quantity: 1, unitPrice: 2.49,  unitCostSnapshot: 0.50 },
    ],
    skipDuplicates: true,
  });

  // Order 2 — confirmed
  const order2 = await prisma.order.upsert({
    where: { orderNumber: "ORD-2025-002" },
    update: {},
    create: {
      orderNumber: "ORD-2025-002",
      status: "confirmed",
      customerName: "Marko Perić",
      customerEmail: "marko.peric@example.com",
      customerPhone: "+385 91 234 5678",
      deliveryDate: new Date("2025-06-12"),
      notes: "Birthday gift. Please include a card.",
      totalAmount: 47.96,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order2.id, productId: whiteTulips.id, quantity: 2, unitPrice: 13.99, unitCostSnapshot: 4.50 },
      { orderId: order2.id, productId: eucalyptus.id,  quantity: 2, unitPrice: 8.99,  unitCostSnapshot: 2.80 },
      { orderId: order2.id, productId: greetingCard.id,quantity: 1, unitPrice: 2.49,  unitCostSnapshot: 0.50 },
    ],
    skipDuplicates: true,
  });

  // Order 3 — draft
  const order3 = await prisma.order.upsert({
    where: { orderNumber: "ORD-2025-003" },
    update: {},
    create: {
      orderNumber: "ORD-2025-003",
      status: "draft",
      customerName: "Petra Blažević",
      customerEmail: "petra.blazevic@example.com",
      deliveryDate: new Date("2025-06-15"),
      notes: "Mother's Day table centrepiece. Still confirming quantity.",
      totalAmount: 42.00,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order3.id, productId: mixedBouquet.id, quantity: 1, unitPrice: 42.00, unitCostSnapshot: 15.00 },
    ],
    skipDuplicates: true,
  });

  console.log("  Created 3 sample orders");
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
