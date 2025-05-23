'use client';

import type { PerformanceMetrics, ProfitLossDataPoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, Activity, BarChartHorizontalBig, Clock } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';


interface MetricDisplayProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
}

const MetricCard: React.FC<MetricDisplayProps> = ({ icon, label, value, description }) => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

interface PerformanceDashboardProps {
  metrics: PerformanceMetrics;
  history: ProfitLossDataPoint[];
}

const chartConfig = {
  profit: {
    label: "Profit/Loss",
    color: "hsl(var(--chart-1))",
  },
};

export default function PerformanceDashboard({ metrics, history }: PerformanceDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          label="Net Profit/Loss"
          value={`$${metrics.netProfitLoss.toFixed(2)}`}
          description="Total P/L from all trades"
        />
        <MetricCard
          icon={<Percent className="h-5 w-5 text-accent" />}
          label="Win Rate"
          value={`${metrics.winRate.toFixed(1)}%`}
          description="Percentage of profitable trades"
        />
        <MetricCard
          icon={<Clock className="h-5 w-5 text-secondary" />}
          label="Avg. Trade Duration"
          value={metrics.avgTradeDuration}
          description="Average holding time per trade"
        />
        <MetricCard
          icon={<BarChartHorizontalBig className="h-5 w-5 text-muted-foreground" />}
          label="Total Trades"
          value={metrics.totalTrades}
          description="Total number of trades executed"
        />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Profit/Loss Over Time</CardTitle>
          <CardDescription>Visual representation of trading performance.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] p-2">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  itemStyle={{ color: chartConfig.profit.color }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Profit/Loss"]}
                />
                <RechartsLegend content={<ChartLegendContent />} />
                <Bar dataKey="profit" fill={chartConfig.profit.color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
