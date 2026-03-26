export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getReportsData } from "@/lib/actions/reports";
import { DEMO_REPORTS } from "@/lib/demo-data";
import { formatCurrency, formatNumber } from "@/lib/format";

export default async function ReportsPage() {
  const dbData = await getReportsData();

  const dbIsEmpty =
    dbData.stockValueSummary.length === 0 &&
    dbData.lowStockProducts.length === 0 &&
    dbData.topSellingProducts.length === 0 &&
    dbData.monthlySalesTotals.every((m) => m.totalSales === 0);

  const data = dbIsEmpty ? DEMO_REPORTS : dbData;

  const totalStockValue = data.stockValueSummary.reduce(
    (sum, row) => sum + row.totalValue,
    0
  );
  const totalStockUnits = data.stockValueSummary.reduce(
    (sum, row) => sum + row.totalUnits,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Sales, inventory, and analytics reports
        </p>
      </div>

      {/* Stock Value Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Value by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.stockValueSummary.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    No products in stock.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {data.stockValueSummary.map((row) => (
                    <TableRow key={row.category}>
                      <TableCell className="capitalize">{row.category}</TableCell>
                      <TableCell className="text-right">{formatNumber(row.totalUnits)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.totalValue)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-medium">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{formatNumber(totalStockUnits)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalStockValue)}</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Low-Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Low-Stock Products
            {data.lowStockProducts.length > 0 && (
              <Badge variant="destructive">{data.lowStockProducts.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Min Stock</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.lowStockProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    All products are sufficiently stocked.
                  </TableCell>
                </TableRow>
              ) : (
                data.lowStockProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.sku ?? "-"}</TableCell>
                    <TableCell className="capitalize">{p.category}</TableCell>
                    <TableCell className="text-right">
                      <span className={p.stockQty === 0 ? "text-destructive font-medium" : ""}>
                        {p.stockQty}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{p.minStock}</TableCell>
                    <TableCell>{p.supplierName}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top-Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top-Selling Products (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Qty Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topSellingProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No fulfilled orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                data.topSellingProducts.map((p, i) => (
                  <TableRow key={p.name}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.sku ?? "-"}</TableCell>
                    <TableCell className="text-right">{formatNumber(p.totalQty)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.totalRevenue)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Sales & Profit Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Totals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.monthlySalesTotals.every((m) => m.totalSales === 0) ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-8 text-center text-muted-foreground">
                      No sales data.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.monthlySalesTotals.map((m) => (
                    <TableRow key={m.month}>
                      <TableCell>{m.month}</TableCell>
                      <TableCell className="text-right">{formatCurrency(m.totalSales)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Gross Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Gross Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.monthlyGrossProfitTotals.every((m) => m.grossProfit === 0) ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-8 text-center text-muted-foreground">
                      No profit data.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.monthlyGrossProfitTotals.map((m) => (
                    <TableRow key={m.month}>
                      <TableCell>{m.month}</TableCell>
                      <TableCell className="text-right">{formatCurrency(m.grossProfit)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
