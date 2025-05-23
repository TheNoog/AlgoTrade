'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { optimizeTradingParameters, type OptimizeTradingParametersInput, type OptimizeTradingParametersOutput } from '@/ai/flows/optimize-trading-parameters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, BarChart, Brain, TrendingUp, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  marketData: z.string().min(50, { message: "Market data must be at least 50 characters long. Please provide detailed data." }),
  algorithmType: z.string().min(1, { message: "Algorithm type is required." }),
  riskTolerance: z.string().min(1, { message: "Risk tolerance is required." }),
});

type AiOptimizerFormValues = z.infer<typeof formSchema>;

const mockMarketData = `Recent AAPL prices: 170.10, 170.15, 170.05, 170.20, 170.25. Volume: 1.2M shares.
Recent MSFT prices: 420.50, 420.60, 420.40, 420.70, 420.75. Volume: 800K shares.
Market sentiment: Neutral. VIX: 15. Key economic indicators: CPI 0.3% MoM, Unemployment 3.8%.
Correlations: AAPL-MSFT: 0.65, AAPL-SPY: 0.80.
Moving Averages (AAPL, 20-day): 168.50. Volatility (AAPL, 30-day historical): 25%.`;

export default function AiOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<OptimizeTradingParametersOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<AiOptimizerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketData: mockMarketData,
      algorithmType: 'movingAverageCrossover',
      riskTolerance: 'medium',
    },
  });

  const onSubmit: SubmitHandler<AiOptimizerFormValues> = async (data) => {
    setIsLoading(true);
    setResults(null);
    try {
      const output = await optimizeTradingParameters(data);
      setResults(output);
      toast({
        title: 'Optimization Complete',
        description: 'AI has generated new parameter recommendations.',
      });
    } catch (error) {
      console.error("AI Optimization Error:", error);
      toast({
        title: 'Optimization Failed',
        description: 'An error occurred while optimizing parameters. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-6 w-6 mr-2 text-primary" />
            AI Parameter Optimizer
          </CardTitle>
          <CardDescription>
            Let AI analyze market data and suggest optimal trading parameters for your algorithms.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="marketData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste real-time market data here (prices, volume, indicators...)"
                        className="min-h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide comprehensive market data for best results.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="algorithmType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Algorithm Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select algorithm type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="movingAverageCrossover">Moving Average Crossover</SelectItem>
                        <SelectItem value="volatilityBreakout">Volatility Breakout</SelectItem>
                        <SelectItem value="rsiDivergence">RSI Divergence</SelectItem>
                        <SelectItem value="meanReversion">Mean Reversion</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Tolerance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk tolerance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Optimize Parameters
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <ScrollArea className="h-full max-h-[calc(100vh-200px)] md:max-h-none">
        <Card className="shadow-lg min-h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-6 w-6 mr-2 text-accent" />
              Optimization Results
            </CardTitle>
            <CardDescription>
              Review the AI-generated recommendations and backtesting insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>AI is processing your request...</p>
                <p>This may take a moment.</p>
              </div>
            )}
            {!isLoading && !results && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <p>Submit the form to get AI-driven parameter optimizations.</p>
              </div>
            )}
            {results && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Optimal Parameters</h3>
                  <pre className="bg-muted p-4 rounded-md text-sm text-muted-foreground whitespace-pre-wrap break-words">{results.optimalParameters}</pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-2">Backtesting Results</h3>
                  <pre className="bg-muted p-4 rounded-md text-sm text-muted-foreground whitespace-pre-wrap break-words">{results.backtestingResults}</pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">Analysis Summary</h3>
                  <pre className="bg-muted p-4 rounded-md text-sm text-muted-foreground whitespace-pre-wrap break-words">{results.analysisSummary}</pre>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
