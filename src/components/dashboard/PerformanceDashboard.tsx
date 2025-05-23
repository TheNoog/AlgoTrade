
'use client';

import type { PerformanceMetrics, ProfitLossDataPoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, Activity, BarChartHorizontalBig, Clock } from 'lucide-react';
import { ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
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

// Custom shape for candlestick
const CandleShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  // x: x-coordinate of the bar's left edge
  // y: y-coordinate of the bar's top edge (corresponds to scaled `high` value from dataKey=['low','high'])
  // width: width of the bar
  // height: height of the bar (corresponds to scaled `high - low` distance)
  
  // Guard against NaN props from Recharts or invalid payload data
  if (typeof x !== 'number' || isNaN(x) || 
      typeof y !== 'number' || isNaN(y) ||
      typeof width !== 'number' || isNaN(width) || width <= 0 ||
      typeof height !== 'number' || isNaN(height) || height < 0 ||
      !payload) {
    // console.warn("CandleShape: Received invalid geometry props or no payload", { x, y, width, height, payload });
    return null; 
  }

  const { open, close, high, low } = payload;

  if (typeof open !== 'number' || isNaN(open) ||
      typeof close !== 'number' || isNaN(close) ||
      typeof high !== 'number' || isNaN(high) ||
      typeof low !== 'number' || isNaN(low)) {
    // console.warn("CandleShape: Received NaN in payload data", payload);
    return null;
  }
  
  const isPositive = close >= open;
  const candleFill = isPositive ? 'hsl(var(--chart-positive))' : 'hsl(var(--chart-negative))';
  
  // Function to scale data value to pixel y-coordinate relative to the bar's y and height
  // The bar's y is for `high` (top of the bounding box), bar's y + height is for `low` (bottom of the bounding box).
  const valToPixel = (val: number) => {
    const range = payload.high - payload.low; // Data range
    if (range === 0) { 
      // If data high and low are the same, all points (o,h,l,c) must be at the same level.
      // props.y is the screen coordinate of payload.high.
      // props.height (pixel height) would be 0.
      return y; 
    }
    // proportion * props.height is the pixel offset from props.y
    const proportion = (payload.high - val) / range;
    return y + proportion * props.height; // props.height is pixel height of high-low range
  };

  const yOpen = valToPixel(open);
  const yClose = valToPixel(close);

  // This check might be redundant if the earlier payload check is comprehensive, but good for safety.
  if (isNaN(yOpen) || isNaN(yClose)) {
    // console.warn("CandleShape: yOpen or yClose became NaN after valToPixel", { yOpen, yClose, payload });
    return null;
  }

  const bodyTopY = Math.min(yOpen, yClose);
  const bodyHeight = Math.max(1, Math.abs(yOpen - yClose)); // Ensure body has min height 1px

  const wickX = x + width / 2; // Centered wick

  return (
    <g>
      {/* Wick: from high (props.y) to low (props.y + props.height) */}
      <line x1={wickX} y1={y} x2={wickX} y2={y + height} stroke={candleFill} strokeWidth={1.5} />
      {/* Body */}
      <rect x={x} y={bodyTopY} width={width} height={bodyHeight} fill={candleFill} />
    </g>
  );
};

const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProfitLossDataPoint; // Full OHLC data
    // Check if data and its properties are valid numbers before calling toFixed
    const open = typeof data.open === 'number' ? data.open.toFixed(2) : 'N/A';
    const high = typeof data.high === 'number' ? data.high.toFixed(2) : 'N/A';
    const low = typeof data.low === 'number' ? data.low.toFixed(2) : 'N/A';
    const close = typeof data.close === 'number' ? data.close.toFixed(2) : 'N/A';

    return (
      <div className="p-2 bg-popover border border-border rounded-md shadow-lg text-popover-foreground text-xs">
        <p className="label font-semibold mb-1">{`${data.name}`}</p>
        <p>{`Open: $${open}`}</p>
        <p>{`High: $${high}`}</p>
        <p>{`Low: $${low}`}</p>
        <p>{`Close: $${close}`}</p>
      </div>
    );
  }
  return null;
};


// Chart config can be simplified or removed if not used for dynamic coloring via CSS vars here
const chartConfig = {
  profit: { // Not directly used for candle colors, but good for legend if we had one
    label: "P/L",
    color: "hsl(var(--chart-1))", // Generic color, actual candle color is conditional
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
          <CardTitle>Profit/Loss Over Time (Candlestick)</CardTitle>
          <CardDescription>Visual representation of trading performance using candlesticks.</CardDescription>
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
                  tickFormatter={(value) => typeof value === 'number' && !isNaN(value) ? `$${value.toFixed(0)}` : '$0'} // Format Y-axis ticks, handle NaN
                  domain={['auto', 'auto']} // Let Recharts determine domain based on OHLC values
                  allowDataOverflow={true}
                />
                <RechartsTooltip content={<CustomTooltipContent />} cursor={{fill: 'hsl(var(--muted)/0.3)'}} />
                {/* 
                  The legend is tricky for candlesticks as there isn't one simple "dataKey" for color.
                  We can omit it or create a custom legend if needed. 
                  For now, omitting RechartsLegend.
                */}
                {/* <RechartsLegend content={<ChartLegendContent />} /> */}
                <Bar 
                  dataKey={['low', 'high']} // This tells Recharts the bar spans from low to high value
                  shape={<CandleShape />} 
                  minPointSize={2} // Ensures even small changes are visible
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

