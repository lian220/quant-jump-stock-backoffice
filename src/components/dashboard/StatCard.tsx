'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel = '지난 달 대비',
  icon: Icon,
  iconColor = 'text-primary',
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className="mt-1 flex items-center text-xs text-muted-foreground">
            {isPositive && <TrendingUp className="mr-1 h-3 w-3 text-green-500" />}
            {isNegative && <TrendingDown className="mr-1 h-3 w-3 text-red-500" />}
            <span className={cn(isPositive && 'text-green-500', isNegative && 'text-red-500')}>
              {isPositive && '+'}
              {change}%
            </span>
            <span className="ml-1">{changeLabel}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
