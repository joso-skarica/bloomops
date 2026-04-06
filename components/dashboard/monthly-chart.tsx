"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyChartProps {
  title: string;
  data: { month: string; value: number }[];
  color?: string;
}

function formatTick(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
}

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function MonthlyChart({ title, data, color = "oklch(0.46 0.09 150)" }: MonthlyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">
            No data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.906 0.008 55)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatTick}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                formatter={(value) => [currencyFmt.format(Number(value ?? 0)), title]}
                labelStyle={{ fontWeight: 600 }}
                contentStyle={{ borderRadius: "8px", border: "1px solid oklch(0.906 0.008 55)" }}
              />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
