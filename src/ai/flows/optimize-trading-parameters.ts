// This is an AI-powered function to optimize trading parameters based on real-time market data.

'use server';

/**
 * @fileOverview An AI agent for optimizing trading parameters based on real-time market data.
 *
 * - optimizeTradingParameters - A function that handles the parameter optimization process.
 * - OptimizeTradingParametersInput - The input type for the optimizeTradingParameters function.
 * - OptimizeTradingParametersOutput - The return type for the optimizeTradingParameters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeTradingParametersInputSchema = z.object({
  marketData: z
    .string()
    .describe(
      'Real-time market data, including stock prices, volume, and other relevant indicators.'
    ),
  algorithmType: z
    .string()
    .describe(
      'The type of trading algorithm to optimize, e.g., moving average crossover, volatility breakout.'
    ),
  riskTolerance: z
    .string()
    .describe(
      'The traders risk tolerance, e.g., low, medium, high.  Used to provide parameters appropriate for their strategy.'
    ),
});
export type OptimizeTradingParametersInput = z.infer<typeof OptimizeTradingParametersInputSchema>;

const OptimizeTradingParametersOutputSchema = z.object({
  optimalParameters: z
    .string()
    .describe(
      'Recommended optimal parameters for the trading algorithm, based on the market data analysis.'
    ),
  backtestingResults: z
    .string()
    .describe(
      'Backtesting results using the recommended parameters, including profit/loss, win rate, and average trade duration.'
    ),
  analysisSummary: z
    .string()
    .describe(
      'A summary of the analysis performed, including key factors considered, such as moving averages, volatility, and correlations.'
    ),
});
export type OptimizeTradingParametersOutput = z.infer<typeof OptimizeTradingParametersOutputSchema>;

export async function optimizeTradingParameters(input: OptimizeTradingParametersInput): Promise<OptimizeTradingParametersOutput> {
  return optimizeTradingParametersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeTradingParametersPrompt',
  input: {schema: OptimizeTradingParametersInputSchema},
  output: {schema: OptimizeTradingParametersOutputSchema},
  prompt: `You are an AI trading assistant specializing in optimizing trading algorithm parameters.

You will receive real-time market data and the type of trading algorithm to optimize. Based on this information, you will recommend optimal parameters for the algorithm and provide backtesting results.

Market Data: {{{marketData}}}
Algorithm Type: {{{algorithmType}}}
Risk Tolerance: {{{riskTolerance}}}

Consider the following factors in your analysis:
- Moving averages
- Volatility
- Correlations

Provide the optimal parameters and backtesting results in a clear and concise format.

`,
});

const optimizeTradingParametersFlow = ai.defineFlow(
  {
    name: 'optimizeTradingParametersFlow',
    inputSchema: OptimizeTradingParametersInputSchema,
    outputSchema: OptimizeTradingParametersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
