import { CandlestickChart } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="bg-card border-b border-border p-4 shadow-md">
      <div className="container mx-auto flex items-center space-x-3">
        <CandlestickChart className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">AlgoTrade Insights</h1>
      </div>
    </header>
  );
}
