'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider"
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Save } from 'lucide-react';
import { useState } from 'react';

const riskManagementSchema = z.object({
  stopLossPercent: z.coerce.number().min(0.1, "Must be > 0").max(50, "Must be <= 50"),
  takeProfitPercent: z.coerce.number().min(0.1, "Must be > 0").max(100, "Must be <= 100"),
  maxPositionSizeUSD: z.coerce.number().min(100, "Must be >= 100"),
  leverage: z.coerce.number().min(1).max(100),
});

type RiskManagementFormValues = z.infer<typeof riskManagementSchema>;

export default function RiskManagement() {
  const { toast } = useToast();
  const [currentLeverage, setCurrentLeverage] = useState(1);

  const form = useForm<RiskManagementFormValues>({
    resolver: zodResolver(riskManagementSchema),
    defaultValues: {
      stopLossPercent: 2,
      takeProfitPercent: 5,
      maxPositionSizeUSD: 10000,
      leverage: 1,
    },
  });
  
  useState(() => {
    setCurrentLeverage(form.getValues("leverage"));
  });


  const onSubmit: SubmitHandler<RiskManagementFormValues> = (data) => {
    console.log("Risk Management Settings:", data);
    // Here you would typically send this data to your C++ backend
    toast({
      title: 'Settings Saved (Simulated)',
      description: 'Risk management parameters have been updated.',
    });
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="h-6 w-6 mr-2 text-primary" />
          Risk Management Controls
        </CardTitle>
        <CardDescription>
          Configure parameters to manage trading risk. These settings would typically be sent to a C++ backend.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="stopLossPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop Loss (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="e.g., 2.5" {...field} />
                  </FormControl>
                  <FormDescription>Maximum percentage loss before closing a position.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="takeProfitPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Take Profit (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="e.g., 5.0" {...field} />
                  </FormControl>
                  <FormDescription>Profit percentage target to close a position.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxPositionSizeUSD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Position Size (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} />
                  </FormControl>
                  <FormDescription>Maximum capital allocated to a single position.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leverage (Current: {currentLeverage}x)</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => {
                        field.onChange(value[0]);
                        setCurrentLeverage(value[0]);
                      }}
                      className="pt-2"
                    />
                  </FormControl>
                  <FormDescription>Trading leverage. Be cautious with high leverage.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Risk Settings
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
