/**
 * Static demo data for BloomOps.
 *
 * Used by list pages to display realistic placeholder content when
 * the database is empty and SHOW_DEMO_CONTENT is enabled.
 *
 * Enable: set SHOW_DEMO_CONTENT=true in .env
 * Disable: remove or set to anything else (default off)
 */

export function isDemoEnabled(): boolean {
  return process.env.SHOW_DEMO_CONTENT === "true";
}

// ─── Products ──────────────────────────────────────────────────────────────

export const DEMO_PRODUCTS = [
  {
    id: "demo-prod-1",
    name: "Red Roses",
    sku: "ROSE-RED-001",
    category: "flowers",
    unit: "bunch",
    costPrice: 8.50,
    sellPrice: 24.99,
    stockQty: 60,
    minStock: 15,
    isActive: true,
    supplier: { id: "demo-sup-1", name: "Dalmatia Flowers Supply" },
  },
  {
    id: "demo-prod-2",
    name: "White Tulips",
    sku: "TULIP-WHT-002",
    category: "flowers",
    unit: "bunch",
    costPrice: 4.50,
    sellPrice: 13.99,
    stockQty: 80,
    minStock: 20,
    isActive: true,
    supplier: { id: "demo-sup-1", name: "Dalmatia Flowers Supply" },
  },
  {
    id: "demo-prod-3",
    name: "Pink Peonies",
    sku: "PEON-PNK-003",
    category: "flowers",
    unit: "bunch",
    costPrice: 12.00,
    sellPrice: 34.99,
    stockQty: 24,
    minStock: 10,
    isActive: true,
    supplier: { id: "demo-sup-5", name: "Coastal Bloom Growers" },
  },
  {
    id: "demo-prod-4",
    name: "Eucalyptus Stems",
    sku: "EUCAL-004",
    category: "flowers",
    unit: "bunch",
    costPrice: 2.80,
    sellPrice: 8.99,
    stockQty: 120,
    minStock: 30,
    isActive: true,
    supplier: { id: "demo-sup-2", name: "Adriatic Floral Wholesale" },
  },
  {
    id: "demo-prod-5",
    name: "Baby's Breath",
    sku: "BABY-WHT-005",
    category: "flowers",
    unit: "bunch",
    costPrice: 3.20,
    sellPrice: 9.49,
    stockQty: 95,
    minStock: 25,
    isActive: true,
    supplier: { id: "demo-sup-2", name: "Adriatic Floral Wholesale" },
  },
  {
    id: "demo-prod-6",
    name: "Satin Ribbon",
    sku: "RIB-SAT-006",
    category: "supplies",
    unit: "each",
    costPrice: 1.20,
    sellPrice: 3.99,
    stockQty: 200,
    minStock: 50,
    isActive: true,
    supplier: { id: "demo-sup-3", name: "Mediteran Packaging" },
  },
  {
    id: "demo-prod-7",
    name: "Kraft Wrapping Paper",
    sku: "WRAP-KFT-007",
    category: "supplies",
    unit: "each",
    costPrice: 0.30,
    sellPrice: 0.99,
    stockQty: 480,
    minStock: 100,
    isActive: true,
    supplier: { id: "demo-sup-3", name: "Mediteran Packaging" },
  },
  {
    id: "demo-prod-8",
    name: "Greeting Cards",
    sku: "CARD-BLK-008",
    category: "supplies",
    unit: "each",
    costPrice: 0.50,
    sellPrice: 2.49,
    stockQty: 4,
    minStock: 20,
    isActive: true,
    supplier: { id: "demo-sup-3", name: "Mediteran Packaging" },
  },
  {
    id: "demo-prod-9",
    name: "Glass Vase",
    sku: "VASE-CLR-009",
    category: "supplies",
    unit: "each",
    costPrice: 3.50,
    sellPrice: 9.99,
    stockQty: 45,
    minStock: 15,
    isActive: true,
    supplier: { id: "demo-sup-4", name: "Flora Studio Partners" },
  },
  {
    id: "demo-prod-10",
    name: "Floral Foam Block",
    sku: "FOAM-BLK-010",
    category: "supplies",
    unit: "each",
    costPrice: 0.90,
    sellPrice: 2.99,
    stockQty: 150,
    minStock: 40,
    isActive: true,
    supplier: { id: "demo-sup-4", name: "Flora Studio Partners" },
  },
];

// ─── Suppliers ─────────────────────────────────────────────────────────────

export const DEMO_SUPPLIERS = [
  {
    id: "demo-sup-1",
    name: "Dalmatia Flowers Supply",
    contact: "Luka Horvat",
    email: "orders@dalmatiaflowers.hr",
    phone: "+385 21 555 0101",
    _count: { products: 2 },
  },
  {
    id: "demo-sup-2",
    name: "Adriatic Floral Wholesale",
    contact: "Maja Blažević",
    email: "wholesale@adriaticfloral.com",
    phone: "+385 51 555 0202",
    _count: { products: 2 },
  },
  {
    id: "demo-sup-3",
    name: "Mediteran Packaging",
    contact: "Ivan Perić",
    email: "sales@mediteranpkg.com",
    phone: "+385 1 555 0303",
    _count: { products: 3 },
  },
  {
    id: "demo-sup-4",
    name: "Flora Studio Partners",
    contact: "Ana Kovačević",
    email: "info@florastudiopartners.com",
    phone: "+385 20 555 0404",
    _count: { products: 2 },
  },
  {
    id: "demo-sup-5",
    name: "Coastal Bloom Growers",
    contact: "Tomislav Jurić",
    email: "contact@coastalbloom.hr",
    phone: "+385 23 555 0505",
    _count: { products: 1 },
  },
  {
    id: "demo-sup-6",
    name: "Sunrise Nursery Co.",
    contact: "Elena Matić",
    email: "hello@sunrisenursery.com",
    phone: "+385 31 555 0606",
    _count: { products: 0 },
  },
];

// ─── Shipments ─────────────────────────────────────────────────────────────

export const DEMO_SHIPMENTS = [
  {
    id: "demo-ship-1",
    supplier: { name: "Dalmatia Flowers Supply" },
    status: "received",
    receivedAt: "2025-06-02",
    total: 1530.00,
  },
  {
    id: "demo-ship-2",
    supplier: { name: "Mediteran Packaging" },
    status: "received",
    receivedAt: "2025-06-05",
    total: 260.00,
  },
  {
    id: "demo-ship-3",
    supplier: { name: "Adriatic Floral Wholesale" },
    status: "received",
    receivedAt: "2025-05-28",
    total: 840.00,
  },
  {
    id: "demo-ship-4",
    supplier: { name: "Flora Studio Partners" },
    status: "pending",
    receivedAt: null,
    total: 475.00,
  },
  {
    id: "demo-ship-5",
    supplier: { name: "Coastal Bloom Growers" },
    status: "pending",
    receivedAt: null,
    total: 210.00,
  },
];

// ─── Orders ────────────────────────────────────────────────────────────────

export const DEMO_ORDERS = [
  {
    id: "demo-ord-1",
    orderNumber: "ORD-2025-001",
    status: "fulfilled",
    customerName: "Ana Kovač",
    deliveryDate: "2025-06-07",
    totalAmount: 61.97,
  },
  {
    id: "demo-ord-2",
    orderNumber: "ORD-2025-002",
    status: "confirmed",
    customerName: "Marko Perić",
    deliveryDate: "2025-06-12",
    totalAmount: 47.96,
  },
  {
    id: "demo-ord-3",
    orderNumber: "ORD-2025-003",
    status: "draft",
    customerName: "Petra Blažević",
    deliveryDate: "2025-06-15",
    totalAmount: 42.00,
  },
  {
    id: "demo-ord-4",
    orderNumber: "ORD-2025-004",
    status: "fulfilled",
    customerName: "Ivana Tomić",
    deliveryDate: "2025-05-30",
    totalAmount: 89.97,
  },
  {
    id: "demo-ord-5",
    orderNumber: "ORD-2025-005",
    status: "confirmed",
    customerName: "Nikola Babić",
    deliveryDate: "2025-06-18",
    totalAmount: 34.99,
  },
  {
    id: "demo-ord-6",
    orderNumber: "ORD-2025-006",
    status: "cancelled",
    customerName: "Josip Radić",
    deliveryDate: "2025-06-10",
    totalAmount: 24.99,
  },
];

// ─── Reports ───────────────────────────────────────────────────────────────

export const DEMO_REPORTS = {
  stockValueSummary: [
    { category: "flowers", totalUnits: 379, totalValue: 2458.20 },
    { category: "supplies", totalUnits: 879, totalValue: 867.50 },
  ],
  lowStockProducts: [
    {
      id: "demo-prod-8",
      name: "Greeting Cards",
      sku: "CARD-BLK-008",
      category: "supplies",
      stockQty: 4,
      minStock: 20,
      supplierName: "Mediteran Packaging",
    },
  ],
  topSellingProducts: [
    { name: "Red Roses", sku: "ROSE-RED-001", totalQty: 124, totalRevenue: 3098.76 },
    { name: "Mixed Seasonal Bouquet", sku: "BOUQ-SEA-004", totalQty: 68, totalRevenue: 2856.00 },
    { name: "White Tulips", sku: "TULIP-WHT-002", totalQty: 92, totalRevenue: 1287.08 },
    { name: "Glass Vase", sku: "VASE-CLR-009", totalQty: 57, totalRevenue: 569.43 },
    { name: "Satin Ribbon", sku: "RIB-SAT-006", totalQty: 185, totalRevenue: 738.15 },
  ],
  monthlySalesTotals: [
    { month: "Jan 2025", totalSales: 1240.00 },
    { month: "Feb 2025", totalSales: 1680.00 },
    { month: "Mar 2025", totalSales: 2150.00 },
    { month: "Apr 2025", totalSales: 1890.00 },
    { month: "May 2025", totalSales: 2420.00 },
    { month: "Jun 2025", totalSales: 1050.00 },
  ],
  monthlyGrossProfitTotals: [
    { month: "Jan 2025", grossProfit: 680.00 },
    { month: "Feb 2025", grossProfit: 920.00 },
    { month: "Mar 2025", grossProfit: 1180.00 },
    { month: "Apr 2025", grossProfit: 1035.00 },
    { month: "May 2025", grossProfit: 1330.00 },
    { month: "Jun 2025", grossProfit: 575.00 },
  ],
};

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const DEMO_DASHBOARD = {
  totalActiveProducts: 9,
  totalSuppliers: 4,
  lowStockCount: 1,
  totalStockUnits: 1258,
  estimatedStockValue: 4280.00,
  ordersThisMonth: 8,
  grossProfitThisMonth: 1420.00,
  recentShipments: [
    {
      id: "demo-ship-1",
      supplierName: "Dalmatia Flowers Supply",
      status: "received",
      createdAt: new Date("2025-06-02"),
      total: 1530.00,
    },
    {
      id: "demo-ship-2",
      supplierName: "Mediteran Packaging",
      status: "received",
      createdAt: new Date("2025-06-05"),
      total: 260.00,
    },
    {
      id: "demo-ship-4",
      supplierName: "Flora Studio Partners",
      status: "pending",
      createdAt: new Date("2025-06-08"),
      total: 475.00,
    },
  ],
  recentOrders: [
    {
      id: "demo-ord-1",
      orderNumber: "ORD-2025-001",
      status: "fulfilled",
      customerName: "Ana Kovač",
      totalAmount: 61.97,
      createdAt: new Date("2025-06-04"),
    },
    {
      id: "demo-ord-2",
      orderNumber: "ORD-2025-002",
      status: "confirmed",
      customerName: "Marko Perić",
      totalAmount: 47.96,
      createdAt: new Date("2025-06-06"),
    },
    {
      id: "demo-ord-5",
      orderNumber: "ORD-2025-005",
      status: "confirmed",
      customerName: "Nikola Babić",
      totalAmount: 34.99,
      createdAt: new Date("2025-06-09"),
    },
  ],
  monthlyData: [
    { month: "Jan 2025", sales: 1240, profit: 680 },
    { month: "Feb 2025", sales: 1680, profit: 920 },
    { month: "Mar 2025", sales: 2150, profit: 1180 },
    { month: "Apr 2025", sales: 1890, profit: 1035 },
    { month: "May 2025", sales: 2420, profit: 1330 },
    { month: "Jun 2025", sales: 1050, profit: 575 },
  ],
};
