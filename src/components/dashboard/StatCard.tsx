'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel = '지난 달 대비',
  icon: Icon,
  iconColor = 'text-emerald-600',
  iconBgColor = 'bg-emerald-100',
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-50 transition-transform group-hover:scale-150" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={cn('rounded-xl p-3', iconBgColor)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
        </div>

        {change !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                isPositive && 'bg-green-100 text-green-700',
                isNegative && 'bg-red-100 text-red-700',
                !isPositive && !isNegative && 'bg-slate-100 text-slate-600',
              )}
            >
              {isPositive && <TrendingUp className="h-3 w-3" />}
              {isNegative && <TrendingDown className="h-3 w-3" />}
              {isPositive && '+'}
              {change}%
            </div>
            <span className="text-xs text-slate-400">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
