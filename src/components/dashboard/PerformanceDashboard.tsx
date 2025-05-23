
'use client';

import type { PerformanceMetrics, ProfitLossDataPoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, Activity, BarChartHorizontalBig, Clock, LineChart as LineChartIcon } from 'lucide-react';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent as ShadCNTooltipContent } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { format } from 'date-fns';

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

const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProfitLossDataPoint;
    const time = typeof data.timestamp === 'number' ? format(new Date(data.timestamp), 'HH:mm:ss') : 'N/A';
    const value = typeof data.value === 'number' ? data.value.toFixed(2) : 'N/A';

    return (
      <div className="p-2 bg-popover border border-border rounded-md shadow-lg text-popover-foreground text-xs">
        <p className="label font-semibold mb-1">{`Time: ${time}`}</p>
        <p>{`P/L: $${value}`}</p>
      </div>
    );
  }
  return null;
};

const chartConfig = {
  profitLoss: {
    label: "Cumulative P/L",
    color: "hsl(var(--chart-1))",
    icon: LineChartIcon,
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
          <CardTitle>Profit/Loss Over Time (Last 1 Hour)</CardTitle>
          <CardDescription>Real-time cumulative profit/loss trend.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] p-2">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={history} 
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                syncId="profitLossSync" // For potential future sync with other charts
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="timestamp" 
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(unixTime) => typeof unixTime === 'number' ? format(new Date(unixTime), 'HH:mm:ss') : ''}
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  interval="preserveStartEnd" // Helps with crowded ticks, adjust as needed
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(value) => typeof value === 'number' && !isNaN(value) ? `$${value.toFixed(0)}` : '$0'}
                  domain={['auto', 'auto']}
                  allowDataOverflow={true}
                />
                <RechartsTooltip 
                  content={<CustomTooltipContent />} 
                  cursor={{stroke: 'hsl(var(--ring))', strokeWidth: 1, strokeDasharray: '3 3'}} 
                />
                <ChartLegend content={<ChartLegendContent />} verticalAlign="top" height={30}/>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={chartConfig.profitLoss.color}
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 2, fill: chartConfig.profitLoss.color }}
                  name={chartConfig.profitLoss.label}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
