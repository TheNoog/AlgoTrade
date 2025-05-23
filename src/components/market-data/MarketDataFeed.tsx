'use client';

import type { StockData } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface MarketDataFeedProps {
  data: StockData[];
}

export default function MarketDataFeed({ data }: MarketDataFeedProps) {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">No market data available.</p>;
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Volume</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((stock) => (
            <TableRow key={stock.id} className="tabular-nums">
              <TableCell className="font-medium">{stock.ticker}</TableCell>
              <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
              <TableCell 
                className={cn(
                  "text-right flex items-center justify-end space-x-1",
                  stock.change > 0 ? "text-green-500" : stock.change < 0 ? "text-red-500" : "text-muted-foreground"
                )}
              >
                <span>{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                {stock.change > 0 && <TrendingUp className="h-4 w-4" />}
                {stock.change < 0 && <TrendingDown className="h-4 w-4" />}
                {stock.change === 0 && <Minus className="h-4 w-4" />}
              </TableCell>
              <TableCell className="text-right">{stock.volume}</TableCell>
              <TableCell className="text-right">
                 <Badge variant={stock.change > 0 ? "default" : stock.change < 0 ? "destructive" : "secondary"} className={cn(stock.change > 0 ? "bg-green-500/20 text-green-400 border-green-500/30" : stock.change < 0 ? "bg-red-500/20 text-red-400 border-red-500/30" : "")}>
                  {stock.change > 0 ? "Up" : stock.change < 0 ? "Down" : "Neutral"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
