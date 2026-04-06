/**
 * BloomOps — Rich multi-month demo seed
 *
 * Creates 6 suppliers, 12 products, ~12 monthly shipments, and ~45 orders
 * spread across the last 10 months so dashboard charts and reports pages
 * show a realistic operating florist business.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const now = new Date();

function daysAgo(n: number) {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d;
}

function monthStart(monthsBack: number) {
  const d = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  return d;
}

function dayInMonth(monthsBack: number, day: number) {
  const d = new Date(now.getFullYear(), now.getMonth() - monthsBack, day);
  return d;
}

async function main() {
  console.log("Seeding BloomOps database …");

  // ─── Suppliers ────────────────────────────────────────────────────────
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
    prisma.supplier.upsert({
      where: { id: "seed-supplier-5" },
      update: {},
      create: {
        id: "seed-supplier-5",
        name: "Coastal Bloom Growers",
        contact: "Tomislav Jurić",
        email: "contact@coastalbloom.hr",
        phone: "+385 23 555 0505",
        address: "Zadar County, Croatia",
        notes: "Peonies and specialty stems; weekly availability list.",
      },
    }),
    prisma.supplier.upsert({
      where: { id: "seed-supplier-6" },
      update: {},
      create: {
        id: "seed-supplier-6",
        name: "Sunrise Nursery Co.",
        contact: "Elena Matić",
        email: "hello@sunrisenursery.com",
        phone: "+385 31 555 0606",
        address: "Varaždin, Croatia",
        notes: "Potted plants and succulents for retail.",
      },
    }),
  ]);

  const [dalmatia, adriatic, mediteran, floraStudio, coastal, sunrise] = suppliers;

  // ─── Products ─────────────────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: "ROSE-RED-001" },
      update: {},
      create: {
        name: "Red Roses",
        sku: "ROSE-RED-001",
        category: "flowers",
        unit: "bunch",
        costPrice: 8.5,
        sellPrice: 24.99,
        stockQty: 60,
        minStock: 15,
        supplierId: dalmatia.id,
        description: "Long-stem red roses. Cut fresh weekly.",
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
        costPrice: 4.5,
        sellPrice: 13.99,
        stockQty: 80,
        minStock: 20,
        supplierId: dalmatia.id,
        description: "10 stems of white Dutch tulips.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "PEON-PNK-003" },
      update: {},
      create: {
        name: "Pink Peonies",
        sku: "PEON-PNK-003",
        category: "flowers",
        unit: "bunch",
        costPrice: 12.0,
        sellPrice: 34.99,
        stockQty: 28,
        minStock: 10,
        supplierId: coastal.id,
        description: "Seasonal peony bunches while in season.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "EUCAL-004" },
      update: {},
      create: {
        name: "Eucalyptus Stems",
        sku: "EUCAL-004",
        category: "flowers",
        unit: "bunch",
        costPrice: 2.8,
        sellPrice: 8.99,
        stockQty: 120,
        minStock: 30,
        supplierId: adriatic.id,
        description: "5 fresh eucalyptus stems for arrangements.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "BOUQ-SEA-005" },
      update: {},
      create: {
        name: "Mixed Seasonal Bouquet",
        sku: "BOUQ-SEA-005",
        category: "arrangements",
        unit: "each",
        costPrice: 15.0,
        sellPrice: 42.0,
        stockQty: 18,
        minStock: 5,
        supplierId: adriatic.id,
        description: "Pre-arranged mixed bouquet using seasonal blooms.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "CARN-WHT-006" },
      update: {},
      create: {
        name: "White Carnations",
        sku: "CARN-WHT-006",
        category: "flowers",
        unit: "bunch",
        costPrice: 6.5,
        sellPrice: 18.99,
        stockQty: 72,
        minStock: 20,
        supplierId: adriatic.id,
        description: "20 stems — long-lasting filler.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "RIB-SAT-007" },
      update: {},
      create: {
        name: "Satin Ribbon",
        sku: "RIB-SAT-007",
        category: "supplies",
        unit: "each",
        costPrice: 1.2,
        sellPrice: 3.99,
        stockQty: 200,
        minStock: 50,
        supplierId: mediteran.id,
        description: "5 m roll — ivory, blush, forest green.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "WRAP-KFT-008" },
      update: {},
      create: {
        name: "Kraft Wrapping Paper",
        sku: "WRAP-KFT-008",
        category: "supplies",
        unit: "each",
        costPrice: 0.3,
        sellPrice: 0.99,
        stockQty: 500,
        minStock: 100,
        supplierId: mediteran.id,
        description: "Single A2 sheet, sold per sheet.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "CARD-BLK-009" },
      update: {},
      create: {
        name: "Greeting Card",
        sku: "CARD-BLK-009",
        category: "supplies",
        unit: "each",
        costPrice: 0.5,
        sellPrice: 2.49,
        stockQty: 3,
        minStock: 20,
        supplierId: mediteran.id,
        description: "Blank inside; assorted designs.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "VASE-CLR-010" },
      update: {},
      create: {
        name: "Glass Vase",
        sku: "VASE-CLR-010",
        category: "supplies",
        unit: "each",
        costPrice: 3.5,
        sellPrice: 9.99,
        stockQty: 45,
        minStock: 15,
        supplierId: floraStudio.id,
        description: "Clear cylinder vase, 20 cm.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "FOAM-BLK-011" },
      update: {},
      create: {
        name: "Floral Foam Block",
        sku: "FOAM-BLK-011",
        category: "supplies",
        unit: "each",
        costPrice: 0.9,
        sellPrice: 2.99,
        stockQty: 150,
        minStock: 40,
        supplierId: floraStudio.id,
        description: "Standard soakable brick.",
      },
    }),
    prisma.product.upsert({
      where: { sku: "SUCC-MIX-012" },
      update: {},
      create: {
        name: "Succulent Arrangement (Small)",
        sku: "SUCC-MIX-012",
        category: "plants",
        unit: "each",
        costPrice: 12.0,
        sellPrice: 34.99,
        stockQty: 22,
        minStock: 8,
        supplierId: sunrise.id,
        description: "Mixed succulents in ceramic bowl.",
      },
    }),
  ]);

  const [
    redRoses, whiteTulips, pinkPeonies, eucalyptus,
    mixedBouquet, carnations, ribbon, kraftPaper,
    greetingCard, glassVase, floralFoam, succulent,
  ] = products;

  // ─── Shipments (one per month for last 10 months + 2 pending) ────────
  const shipmentDefs: {
    id: string;
    supplierId: string;
    status: "received" | "pending";
    expectedAt: Date;
    receivedAt: Date | null;
    notes: string;
    items: { productId: string; quantity: number; unitCost: number }[];
  }[] = [
    {
      id: "seed-ship-m10",
      supplierId: dalmatia.id,
      status: "received",
      expectedAt: dayInMonth(9, 3),
      receivedAt: dayInMonth(9, 4),
      notes: "Summer roses restock.",
      items: [
        { productId: redRoses.id, quantity: 60, unitCost: 8.5 },
        { productId: whiteTulips.id, quantity: 80, unitCost: 4.5 },
      ],
    },
    {
      id: "seed-ship-m9",
      supplierId: adriatic.id,
      status: "received",
      expectedAt: dayInMonth(8, 5),
      receivedAt: dayInMonth(8, 6),
      notes: "Greenery and bouquet stock.",
      items: [
        { productId: eucalyptus.id, quantity: 100, unitCost: 2.8 },
        { productId: mixedBouquet.id, quantity: 15, unitCost: 15.0 },
        { productId: carnations.id, quantity: 50, unitCost: 6.5 },
      ],
    },
    {
      id: "seed-ship-m8",
      supplierId: mediteran.id,
      status: "received",
      expectedAt: dayInMonth(7, 2),
      receivedAt: dayInMonth(7, 3),
      notes: "Q3 packaging restock.",
      items: [
        { productId: ribbon.id, quantity: 80, unitCost: 1.2 },
        { productId: kraftPaper.id, quantity: 200, unitCost: 0.3 },
        { productId: greetingCard.id, quantity: 60, unitCost: 0.5 },
      ],
    },
    {
      id: "seed-ship-m7",
      supplierId: coastal.id,
      status: "received",
      expectedAt: dayInMonth(6, 10),
      receivedAt: dayInMonth(6, 12),
      notes: "Fall peony delivery.",
      items: [
        { productId: pinkPeonies.id, quantity: 30, unitCost: 12.0 },
      ],
    },
    {
      id: "seed-ship-m6",
      supplierId: dalmatia.id,
      status: "received",
      expectedAt: dayInMonth(5, 4),
      receivedAt: dayInMonth(5, 5),
      notes: "Weekly flowers — late October.",
      items: [
        { productId: redRoses.id, quantity: 50, unitCost: 8.5 },
        { productId: whiteTulips.id, quantity: 60, unitCost: 4.5 },
      ],
    },
    {
      id: "seed-ship-m5",
      supplierId: floraStudio.id,
      status: "received",
      expectedAt: dayInMonth(4, 8),
      receivedAt: dayInMonth(4, 9),
      notes: "Vases and foam restock.",
      items: [
        { productId: glassVase.id, quantity: 30, unitCost: 3.5 },
        { productId: floralFoam.id, quantity: 60, unitCost: 0.9 },
      ],
    },
    {
      id: "seed-ship-m4",
      supplierId: adriatic.id,
      status: "received",
      expectedAt: dayInMonth(3, 6),
      receivedAt: dayInMonth(3, 7),
      notes: "Holiday greenery and carnations.",
      items: [
        { productId: eucalyptus.id, quantity: 120, unitCost: 2.8 },
        { productId: carnations.id, quantity: 80, unitCost: 6.5 },
      ],
    },
    {
      id: "seed-ship-m3",
      supplierId: mediteran.id,
      status: "received",
      expectedAt: dayInMonth(2, 3),
      receivedAt: dayInMonth(2, 4),
      notes: "New year packaging order.",
      items: [
        { productId: ribbon.id, quantity: 100, unitCost: 1.2 },
        { productId: kraftPaper.id, quantity: 300, unitCost: 0.3 },
        { productId: greetingCard.id, quantity: 80, unitCost: 0.5 },
      ],
    },
    {
      id: "seed-ship-m2",
      supplierId: sunrise.id,
      status: "received",
      expectedAt: dayInMonth(1, 5),
      receivedAt: dayInMonth(1, 6),
      notes: "Spring succulents restocked.",
      items: [
        { productId: succulent.id, quantity: 20, unitCost: 12.0 },
      ],
    },
    {
      id: "seed-ship-m1",
      supplierId: dalmatia.id,
      status: "received",
      expectedAt: dayInMonth(0, 2),
      receivedAt: dayInMonth(0, 3),
      notes: "This month's fresh cut flowers.",
      items: [
        { productId: redRoses.id, quantity: 70, unitCost: 8.5 },
        { productId: whiteTulips.id, quantity: 90, unitCost: 4.5 },
        { productId: pinkPeonies.id, quantity: 25, unitCost: 12.0 },
      ],
    },
    {
      id: "seed-ship-pending1",
      supplierId: floraStudio.id,
      status: "pending",
      expectedAt: daysAgo(-7),
      receivedAt: null,
      notes: "Awaiting vases and foam — delivery next week.",
      items: [
        { productId: glassVase.id, quantity: 24, unitCost: 3.5 },
        { productId: floralFoam.id, quantity: 40, unitCost: 0.9 },
      ],
    },
    {
      id: "seed-ship-pending2",
      supplierId: coastal.id,
      status: "pending",
      expectedAt: daysAgo(-3),
      receivedAt: null,
      notes: "Peony pre-order for wedding season.",
      items: [
        { productId: pinkPeonies.id, quantity: 36, unitCost: 12.0 },
      ],
    },
  ];

  for (const def of shipmentDefs) {
    const ship = await prisma.shipment.upsert({
      where: { id: def.id },
      update: {},
      create: {
        id: def.id,
        supplierId: def.supplierId,
        status: def.status,
        expectedAt: def.expectedAt,
        receivedAt: def.receivedAt,
        notes: def.notes,
      },
    });
    await prisma.shipmentItem.createMany({
      data: def.items.map((it) => ({
        shipmentId: ship.id,
        productId: it.productId,
        quantity: it.quantity,
        unitCost: it.unitCost,
      })),
      skipDuplicates: true,
    });
  }

  // ─── Orders (spread across last 10 months) ───────────────────────────
  // Helper: realistic Croatian customer names
  const customers = [
    { name: "Ana Kovač", email: "ana.kovac@example.com", phone: "+385 98 123 4567" },
    { name: "Marko Perić", email: "marko.peric@example.com", phone: "+385 91 234 5678" },
    { name: "Petra Blažević", email: "petra.blazevic@example.com", phone: null },
    { name: "Ivana Tomić", email: "ivana.tomic@example.com", phone: "+385 99 111 2222" },
    { name: "Nikola Babić", email: "nikola.b@example.com", phone: "+385 92 333 4444" },
    { name: "Marina Šimić", email: "marina.s@example.com", phone: "+385 95 555 6666" },
    { name: "Luka Vuković", email: "luka.v@example.com", phone: "+385 97 777 8888" },
    { name: "Tea Horvat", email: "tea.h@example.com", phone: "+385 91 000 1111" },
    { name: "Office Bloom Ltd", email: "orders@officebloom.hr", phone: "+385 1 600 7000" },
    { name: "Josip Radić", email: "josip.r@example.com", phone: null },
    { name: "Elena Matić", email: "elena.m@example.com", phone: "+385 98 444 5555" },
    { name: "Dario Horvat", email: "dario.h@example.com", phone: "+385 91 222 3333" },
    { name: "Karla Jurić", email: "karla.j@example.com", phone: "+385 95 888 9999" },
    { name: "Hotel Marjan", email: "flowers@hotelmarjan.hr", phone: "+385 21 600 100" },
    { name: "Maja Novak", email: "maja.n@example.com", phone: "+385 92 111 0000" },
  ];

  let orderSeq = 1;
  function nextOrderNum() {
    const num = String(orderSeq++).padStart(3, "0");
    return `ORD-2025-${num}`;
  }

  type OrderDef = {
    orderNumber: string;
    status: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    deliveryDate: Date;
    notes: string;
    totalAmount: number;
    createdAt: Date;
    items: { productId: string; quantity: number; unitPrice: number; unitCostSnapshot: number }[];
  };

  const orderDefs: OrderDef[] = [];

  function addOrder(
    monthsBack: number,
    day: number,
    custIdx: number,
    status: string,
    notes: string,
    items: { productId: string; qty: number; price: number; cost: number }[],
  ) {
    const c = customers[custIdx % customers.length];
    const created = dayInMonth(monthsBack, day);
    const delivery = new Date(created);
    delivery.setDate(delivery.getDate() + (status === "draft" ? 14 : 5));
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    orderDefs.push({
      orderNumber: nextOrderNum(),
      status,
      customerName: c.name,
      customerEmail: c.email,
      customerPhone: c.phone,
      deliveryDate: delivery,
      notes,
      totalAmount: Math.round(total * 100) / 100,
      createdAt: created,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.qty,
        unitPrice: i.price,
        unitCostSnapshot: i.cost,
      })),
    });
  }

  // Month -9 (≈ Jul 2025): 3 orders — summer start
  addOrder(9, 5, 0, "fulfilled", "Summer anniversary bouquet.", [
    { productId: redRoses.id, qty: 3, price: 24.99, cost: 8.5 },
    { productId: glassVase.id, qty: 1, price: 9.99, cost: 3.5 },
  ]);
  addOrder(9, 12, 1, "fulfilled", "Birthday gift — tulips.", [
    { productId: whiteTulips.id, qty: 2, price: 13.99, cost: 4.5 },
    { productId: greetingCard.id, qty: 1, price: 2.49, cost: 0.5 },
  ]);
  addOrder(9, 20, 13, "fulfilled", "Hotel lobby weekly flowers.", [
    { productId: mixedBouquet.id, qty: 4, price: 42.0, cost: 15.0 },
    { productId: eucalyptus.id, qty: 3, price: 8.99, cost: 2.8 },
  ]);

  // Month -8 (≈ Aug 2025): 4 orders — holiday season ramp
  addOrder(8, 3, 2, "fulfilled", "Summer garden party centrepieces.", [
    { productId: mixedBouquet.id, qty: 3, price: 42.0, cost: 15.0 },
    { productId: carnations.id, qty: 2, price: 18.99, cost: 6.5 },
  ]);
  addOrder(8, 10, 3, "fulfilled", "Corporate lobby arrangement.", [
    { productId: eucalyptus.id, qty: 5, price: 8.99, cost: 2.8 },
    { productId: redRoses.id, qty: 2, price: 24.99, cost: 8.5 },
  ]);
  addOrder(8, 18, 4, "fulfilled", "Thank-you peonies.", [
    { productId: pinkPeonies.id, qty: 2, price: 34.99, cost: 12.0 },
    { productId: ribbon.id, qty: 2, price: 3.99, cost: 1.2 },
  ]);
  addOrder(8, 25, 5, "fulfilled", "Wedding table flowers.", [
    { productId: whiteTulips.id, qty: 8, price: 13.99, cost: 4.5 },
    { productId: carnations.id, qty: 4, price: 18.99, cost: 6.5 },
    { productId: ribbon.id, qty: 4, price: 3.99, cost: 1.2 },
  ]);

  // Month -7 (≈ Sep 2025): 4 orders
  addOrder(7, 2, 6, "fulfilled", "Office opening gifts — succulents.", [
    { productId: succulent.id, qty: 6, price: 34.99, cost: 12.0 },
  ]);
  addOrder(7, 8, 7, "fulfilled", "Bridal consultation follow-up.", [
    { productId: redRoses.id, qty: 2, price: 24.99, cost: 8.5 },
    { productId: pinkPeonies.id, qty: 1, price: 34.99, cost: 12.0 },
    { productId: ribbon.id, qty: 3, price: 3.99, cost: 1.2 },
  ]);
  addOrder(7, 15, 8, "fulfilled", "Monthly office reception flowers.", [
    { productId: carnations.id, qty: 4, price: 18.99, cost: 6.5 },
    { productId: eucalyptus.id, qty: 6, price: 8.99, cost: 2.8 },
    { productId: glassVase.id, qty: 2, price: 9.99, cost: 3.5 },
  ]);
  addOrder(7, 22, 9, "cancelled", "Customer cancelled — scheduling conflict.", [
    { productId: redRoses.id, qty: 1, price: 24.99, cost: 8.5 },
  ]);

  // Month -6 (≈ Oct 2025): 5 orders — autumn peak
  addOrder(6, 3, 10, "fulfilled", "Teacher appreciation bouquets.", [
    { productId: mixedBouquet.id, qty: 3, price: 42.0, cost: 15.0 },
    { productId: greetingCard.id, qty: 3, price: 2.49, cost: 0.5 },
  ]);
  addOrder(6, 8, 11, "fulfilled", "Autumn centrepiece order.", [
    { productId: carnations.id, qty: 6, price: 18.99, cost: 6.5 },
    { productId: eucalyptus.id, qty: 4, price: 8.99, cost: 2.8 },
  ]);
  addOrder(6, 14, 12, "fulfilled", "Birthday roses.", [
    { productId: redRoses.id, qty: 3, price: 24.99, cost: 8.5 },
    { productId: kraftPaper.id, qty: 3, price: 0.99, cost: 0.3 },
    { productId: ribbon.id, qty: 2, price: 3.99, cost: 1.2 },
  ]);
  addOrder(6, 20, 13, "fulfilled", "Hotel Marjan — weekly lobby flowers.", [
    { productId: mixedBouquet.id, qty: 5, price: 42.0, cost: 15.0 },
    { productId: redRoses.id, qty: 3, price: 24.99, cost: 8.5 },
  ]);
  addOrder(6, 27, 14, "fulfilled", "Get-well bouquet.", [
    { productId: whiteTulips.id, qty: 3, price: 13.99, cost: 4.5 },
    { productId: glassVase.id, qty: 1, price: 9.99, cost: 3.5 },
  ]);

  // Month -5 (≈ Nov 2025): 5 orders — pre-holiday
  addOrder(5, 2, 0, "fulfilled", "Thanksgiving centrepiece.", [
    { productId: mixedBouquet.id, qty: 2, price: 42.0, cost: 15.0 },
    { productId: eucalyptus.id, qty: 4, price: 8.99, cost: 2.8 },
  ]);
  addOrder(5, 9, 1, "fulfilled", "Engagement party flowers.", [
    { productId: redRoses.id, qty: 5, price: 24.99, cost: 8.5 },
    { productId: pinkPeonies.id, qty: 3, price: 34.99, cost: 12.0 },
    { productId: ribbon.id, qty: 5, price: 3.99, cost: 1.2 },
  ]);
  addOrder(5, 15, 3, "fulfilled", "Corporate holiday gifts.", [
    { productId: succulent.id, qty: 8, price: 34.99, cost: 12.0 },
    { productId: greetingCard.id, qty: 8, price: 2.49, cost: 0.5 },
  ]);
  addOrder(5, 22, 5, "fulfilled", "Wedding rehearsal dinner.", [
    { productId: whiteTulips.id, qty: 6, price: 13.99, cost: 4.5 },
    { productId: carnations.id, qty: 4, price: 18.99, cost: 6.5 },
    { productId: glassVase.id, qty: 3, price: 9.99, cost: 3.5 },
  ]);
  addOrder(5, 28, 8, "fulfilled", "Monthly office subscription.", [
    { productId: carnations.id, qty: 3, price: 18.99, cost: 6.5 },
    { productId: eucalyptus.id, qty: 5, price: 8.99, cost: 2.8 },
  ]);

  // Month -4 (≈ Dec 2025): 6 orders — Christmas peak
  addOrder(4, 1, 10, "fulfilled", "Christmas wreath supplies.", [
    { productId: eucalyptus.id, qty: 10, price: 8.99, cost: 2.8 },
    { productId: ribbon.id, qty: 8, price: 3.99, cost: 1.2 },
    { productId: floralFoam.id, qty: 6, price: 2.99, cost: 0.9 },
  ]);
  addOrder(4, 6, 11, "fulfilled", "Holiday party centrepieces.", [
    { productId: redRoses.id, qty: 6, price: 24.99, cost: 8.5 },
    { productId: carnations.id, qty: 4, price: 18.99, cost: 6.5 },
  ]);
  addOrder(4, 12, 12, "fulfilled", "Christmas gift bouquets.", [
    { productId: mixedBouquet.id, qty: 4, price: 42.0, cost: 15.0 },
    { productId: greetingCard.id, qty: 4, price: 2.49, cost: 0.5 },
  ]);
  addOrder(4, 18, 13, "fulfilled", "Hotel Marjan — Christmas lobby.", [
    { productId: redRoses.id, qty: 8, price: 24.99, cost: 8.5 },
    { productId: pinkPeonies.id, qty: 4, price: 34.99, cost: 12.0 },
    { productId: eucalyptus.id, qty: 6, price: 8.99, cost: 2.8 },
  ]);
  addOrder(4, 23, 6, "fulfilled", "Last-minute Christmas order.", [
    { productId: whiteTulips.id, qty: 4, price: 13.99, cost: 4.5 },
    { productId: ribbon.id, qty: 3, price: 3.99, cost: 1.2 },
  ]);
  addOrder(4, 28, 14, "fulfilled", "New Year's Eve table flowers.", [
    { productId: carnations.id, qty: 5, price: 18.99, cost: 6.5 },
    { productId: mixedBouquet.id, qty: 2, price: 42.0, cost: 15.0 },
    { productId: glassVase.id, qty: 2, price: 9.99, cost: 3.5 },
  ]);

  // Month -3 (≈ Jan 2026): 4 orders — post-holiday dip
  addOrder(3, 5, 0, "fulfilled", "New year fresh start bouquet.", [
    { productId: whiteTulips.id, qty: 3, price: 13.99, cost: 4.5 },
    { productId: eucalyptus.id, qty: 2, price: 8.99, cost: 2.8 },
  ]);
  addOrder(3, 12, 2, "fulfilled", "Birthday roses delivery.", [
    { productId: redRoses.id, qty: 2, price: 24.99, cost: 8.5 },
    { productId: greetingCard.id, qty: 1, price: 2.49, cost: 0.5 },
  ]);
  addOrder(3, 18, 4, "fulfilled", "Thank-you arrangement.", [
    { productId: mixedBouquet.id, qty: 1, price: 42.0, cost: 15.0 },
    { productId: kraftPaper.id, qty: 1, price: 0.99, cost: 0.3 },
  ]);
  addOrder(3, 25, 9, "cancelled", "Cancelled — wrong date.", [
    { productId: pinkPeonies.id, qty: 1, price: 34.99, cost: 12.0 },
  ]);

  // Month -2 (≈ Feb 2026): 6 orders — Valentine's spike
  addOrder(2, 2, 1, "fulfilled", "Valentine's roses — early bird.", [
    { productId: redRoses.id, qty: 4, price: 24.99, cost: 8.5 },
    { productId: greetingCard.id, qty: 2, price: 2.49, cost: 0.5 },
  ]);
  addOrder(2, 8, 3, "fulfilled", "Valentine's corporate order.", [
    { productId: redRoses.id, qty: 10, price: 24.99, cost: 8.5 },
    { productId: ribbon.id, qty: 10, price: 3.99, cost: 1.2 },
    { productId: kraftPaper.id, qty: 10, price: 0.99, cost: 0.3 },
  ]);
  addOrder(2, 12, 5, "fulfilled", "Valentine's bouquet.", [
    { productId: pinkPeonies.id, qty: 3, price: 34.99, cost: 12.0 },
    { productId: whiteTulips.id, qty: 2, price: 13.99, cost: 4.5 },
  ]);
  addOrder(2, 14, 7, "fulfilled", "Valentine's Day — last minute.", [
    { productId: redRoses.id, qty: 3, price: 24.99, cost: 8.5 },
    { productId: glassVase.id, qty: 1, price: 9.99, cost: 3.5 },
  ]);
  addOrder(2, 20, 8, "fulfilled", "Monthly office subscription.", [
    { productId: carnations.id, qty: 4, price: 18.99, cost: 6.5 },
    { productId: eucalyptus.id, qty: 6, price: 8.99, cost: 2.8 },
  ]);
  addOrder(2, 26, 12, "fulfilled", "Sympathy flowers.", [
    { productId: whiteTulips.id, qty: 4, price: 13.99, cost: 4.5 },
    { productId: carnations.id, qty: 3, price: 18.99, cost: 6.5 },
  ]);

  // Month -1 (≈ Mar 2026): 5 orders — spring ramp
  addOrder(1, 3, 10, "fulfilled", "Spring arrangement for lobby.", [
    { productId: mixedBouquet.id, qty: 3, price: 42.0, cost: 15.0 },
    { productId: eucalyptus.id, qty: 4, price: 8.99, cost: 2.8 },
  ]);
  addOrder(1, 10, 11, "fulfilled", "Mother's Day early order.", [
    { productId: redRoses.id, qty: 3, price: 24.99, cost: 8.5 },
    { productId: pinkPeonies.id, qty: 2, price: 34.99, cost: 12.0 },
    { productId: greetingCard.id, qty: 2, price: 2.49, cost: 0.5 },
  ]);
  addOrder(1, 17, 13, "fulfilled", "Hotel Marjan — March lobby.", [
    { productId: mixedBouquet.id, qty: 4, price: 42.0, cost: 15.0 },
    { productId: redRoses.id, qty: 2, price: 24.99, cost: 8.5 },
  ]);
  addOrder(1, 22, 14, "fulfilled", "Birthday surprise.", [
    { productId: succulent.id, qty: 2, price: 34.99, cost: 12.0 },
    { productId: greetingCard.id, qty: 1, price: 2.49, cost: 0.5 },
  ]);
  addOrder(1, 28, 6, "fulfilled", "Easter centrepiece.", [
    { productId: whiteTulips.id, qty: 5, price: 13.99, cost: 4.5 },
    { productId: carnations.id, qty: 3, price: 18.99, cost: 6.5 },
    { productId: ribbon.id, qty: 3, price: 3.99, cost: 1.2 },
  ]);

  // Month 0 (current — Apr 2026): 5 orders (mix of statuses)
  addOrder(0, 2, 0, "fulfilled", "Anniversary — red and white palette.", [
    { productId: redRoses.id, qty: 2, price: 24.99, cost: 8.5 },
    { productId: glassVase.id, qty: 1, price: 9.99, cost: 3.5 },
    { productId: greetingCard.id, qty: 1, price: 2.49, cost: 0.5 },
  ]);
  addOrder(0, 4, 4, "fulfilled", "Thank-you peonies.", [
    { productId: pinkPeonies.id, qty: 2, price: 34.99, cost: 12.0 },
    { productId: ribbon.id, qty: 2, price: 3.99, cost: 1.2 },
  ]);
  addOrder(0, 5, 5, "confirmed", "Wedding table bundles — next week.", [
    { productId: whiteTulips.id, qty: 8, price: 13.99, cost: 4.5 },
    { productId: carnations.id, qty: 6, price: 18.99, cost: 6.5 },
    { productId: ribbon.id, qty: 6, price: 3.99, cost: 1.2 },
  ]);
  addOrder(0, 5, 2, "draft", "Mother's Day centrepiece — quantity TBC.", [
    { productId: mixedBouquet.id, qty: 2, price: 42.0, cost: 15.0 },
  ]);
  addOrder(0, 6, 8, "confirmed", "Monthly office subscription — April.", [
    { productId: carnations.id, qty: 3, price: 18.99, cost: 6.5 },
    { productId: eucalyptus.id, qty: 5, price: 8.99, cost: 2.8 },
  ]);

  for (const def of orderDefs) {
    const order = await prisma.order.upsert({
      where: { orderNumber: def.orderNumber },
      update: {},
      create: {
        orderNumber: def.orderNumber,
        status: def.status,
        customerName: def.customerName,
        customerEmail: def.customerEmail,
        customerPhone: def.customerPhone,
        deliveryDate: def.deliveryDate,
        notes: def.notes,
        totalAmount: def.totalAmount,
        createdAt: def.createdAt,
      },
    });
    await prisma.orderItem.createMany({
      data: def.items.map((it) => ({
        orderId: order.id,
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        unitCostSnapshot: it.unitCostSnapshot,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`Seed completed: ${suppliers.length} suppliers, ${products.length} products, ${shipmentDefs.length} shipments, ${orderDefs.length} orders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
