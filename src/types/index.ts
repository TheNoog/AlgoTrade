export interface StockData {
  id: string;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  lastUpdated: number; // Timestamp for animation trigger
}

export interface PerformanceMetrics {
  netProfitLoss: number;
  winRate: number; // Percentage 0-100
  avgTradeDuration: string; // e.g., "45s", "2m 10s"
  totalTrades: number;
}

export interface ProfitLossDataPoint {
  name: string; // Timestamp or trade number
  profit: number; // Profit/Loss
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  variant: 'default' | 'destructive';
  timestamp: Date;
}
