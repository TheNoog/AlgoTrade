
'use client';

import { useEffect, useState, useCallback } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import MarketDataFeed from '@/components/market-data/MarketDataFeed';
import PerformanceDashboard from '@/components/dashboard/PerformanceDashboard';
import AiOptimizer from '@/components/ai-optimizer/AiOptimizer';
import RiskManagement from '@/components/risk-management/RiskManagement';
import SystemAlertsDisplay from '@/components/system-alerts/SystemAlertsDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandlestickChart as CandlestickIcon, LayoutDashboard, Bot, ShieldCheck, Bell } from 'lucide-react'; // Renamed to avoid conflict with chart component
import type { StockData, PerformanceMetrics, ProfitLossDataPoint, SystemAlert } from '@/types';
import { useToast } from '@/hooks/use-toast';

const initialMarketData: StockData[] = [
  { id: '1', ticker: 'AAPL', price: 170.34, change: 1.22, changePercent: 0.72, volume: '98.7M', lastUpdated: Date.now() },
  { id: '2', ticker: 'MSFT', price: 420.55, change: -0.89, changePercent: -0.21, volume: '76.5M', lastUpdated: Date.now() },
  { id: '3', ticker: 'GOOGL', price: 175.12, change: 2.50, changePercent: 1.45, volume: '65.3M', lastUpdated: Date.now() },
  { id: '4', ticker: 'AMZN', price: 180.67, change: -1.15, changePercent: -0.63, volume: '55.1M', lastUpdated: Date.now() },
  { id: '5', ticker: 'NVDA', price: 900.20, change: 10.45, changePercent: 1.18, volume: '120.2M', lastUpdated: Date.now() },
];

const initialPerformanceMetrics: PerformanceMetrics = {
  netProfitLoss: 1250.75,
  winRate: 65.7,
  avgTradeDuration: "2h 15m",
  totalTrades: 152,
};

// Initial P/L history (empty, will populate in real-time)
const initialProfitLossHistory: ProfitLossDataPoint[] = [];


export default function AlgoTradePage() {
  const [marketData, setMarketData] = useState<StockData[]>(initialMarketData);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(initialPerformanceMetrics);
  const [profitLossHistory, setProfitLossHistory] = useState<ProfitLossDataPoint[]>(initialProfitLossHistory);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const { toast } = useToast();

  const addSystemAlert = useCallback((title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    const newAlert: SystemAlert = {
      id: Date.now().toString(),
      title,
      description,
      variant,
      timestamp: new Date(),
    };
    setSystemAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep last 20 alerts
    toast({ title, description, variant });
  }, [toast]);
  
  useEffect(() => {
    addSystemAlert('System Initialized', 'AlgoTrade Insights is online and operational.', 'default');
    // Add an initial point to the P/L history to start the graph
    setProfitLossHistory([{ timestamp: Date.now(), value: initialPerformanceMetrics.netProfitLoss }]);
    setTimeout(() => {
      addSystemAlert('Backend Warning', 'Simulated intermittent connection to C++ backend.', 'destructive');
    }, 5000);
  }, [addSystemAlert, initialPerformanceMetrics.netProfitLoss]);


  useEffect(() => {
    const marketInterval = setInterval(() => {
      setMarketData(prevData =>
        prevData.map(stock => {
          const priceChange = (Math.random() - 0.5) * (stock.price * 0.01); 
          const newPrice = Math.max(0.01, stock.price + priceChange);
          const change = newPrice - stock.price;
          const changePercent = (change / stock.price) * 100;
          return { ...stock, price: newPrice, change, changePercent, lastUpdated: Date.now() };
        })
      );
    }, 3000); 

    const performanceInterval = setInterval(() => {
      setPerformanceMetrics(prevMetrics => {
        const pnlChange = (Math.random() - 0.45) * 200; // Increased PNL change range
        const newPnl = prevMetrics.netProfitLoss + pnlChange;
        const newTotalTrades = prevMetrics.totalTrades + 1;
        const newWinRate = prevMetrics.winRate + (Math.random()-0.48)*0.1; 

        setProfitLossHistory(prevHistory => {
            const currentTime = Date.now();
            const oneHourAgo = currentTime - 3600 * 1000; // 1 hour in milliseconds

            const newPoint: ProfitLossDataPoint = {
              timestamp: currentTime,
              value: newPnl,
            };
            
            const updatedHistory = [...prevHistory, newPoint].filter(
              point => point.timestamp >= oneHourAgo
            );
            return updatedHistory;
        });

        return {
          ...prevMetrics,
          netProfitLoss: newPnl,
          totalTrades: newTotalTrades,
          winRate: Math.min(100, Math.max(0, newWinRate)), 
          avgTradeDuration: `${Math.floor(Math.random()*59 +1)}s` 
        };
      });
    }, 5000); 

    return () => {
      clearInterval(marketInterval);
      clearInterval(performanceInterval);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <Tabs defaultValue="dashboard" className="w-full"> {/* Default to dashboard to see new chart */}
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6 bg-card border border-border shadow-sm">
            <TabsTrigger value="market-data" className="flex items-center space-x-2 py-3">
              <CandlestickIcon className="h-5 w-5" />
              <span>Market Data</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 py-3">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="ai-optimizer" className="flex items-center space-x-2 py-3">
              <Bot className="h-5 w-5" />
              <span>AI Optimizer</span>
            </TabsTrigger>
            <TabsTrigger value="risk-management" className="flex items-center space-x-2 py-3">
              <ShieldCheck className="h-5 w-5" />
              <span>Risk Controls</span>
            </TabsTrigger>
            <TabsTrigger value="system-alerts" className="flex items-center space-x-2 py-3">
              <Bell className="h-5 w-5" />
              <span>System Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market-data">
            <MarketDataFeed data={marketData} />
          </TabsContent>
          <TabsContent value="dashboard">
            <PerformanceDashboard metrics={performanceMetrics} history={profitLossHistory} />
          </TabsContent>
          <TabsContent value="ai-optimizer">
            <AiOptimizer />
          </TabsContent>
          <TabsContent value="risk-management">
            <RiskManagement />
          </TabsContent>
          <TabsContent value="system-alerts">
            <SystemAlertsDisplay alerts={systemAlerts} />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} AlgoTrade Insights. All rights reserved. Trading involves risk.
      </footer>
    </div>
  );
}
