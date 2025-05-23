
'use client';

import type { SystemAlert } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, XOctagon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SystemAlertsDisplayProps {
  alerts: SystemAlert[];
}

const alertIcons = {
  default: <Info className="h-4 w-4" />,
  destructive: <XOctagon className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />, // Example for future use
  warning: <AlertCircle className="h-4 w-4" />, // Example for future use
};

export default function SystemAlertsDisplay({ alerts }: SystemAlertsDisplayProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No system notifications at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>System Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {alerts.slice().reverse().map((alert) => ( // Show newest first
              <Alert key={alert.id} variant={alert.variant} className="shadow-md">
                {alert.variant === 'destructive' ? alertIcons.destructive : alertIcons.default}
                <AlertTitle>{alert.title} - <span className="text-xs text-muted-foreground">{alert.timestamp.toLocaleTimeString()}</span></AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
