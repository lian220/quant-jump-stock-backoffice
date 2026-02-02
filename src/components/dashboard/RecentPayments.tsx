'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const recentPayments = [
  {
    id: '1',
    user: 'user1@example.com',
    amount: 29000,
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: '2',
    user: 'user2@example.com',
    amount: 59000,
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: '3',
    user: 'user3@example.com',
    amount: 29000,
    status: 'pending',
    date: '2024-01-14',
  },
  {
    id: '4',
    user: 'user4@example.com',
    amount: 99000,
    status: 'completed',
    date: '2024-01-14',
  },
  {
    id: '5',
    user: 'user5@example.com',
    amount: 29000,
    status: 'failed',
    date: '2024-01-13',
  },
];

const statusMap = {
  completed: { label: '완료', variant: 'default' as const },
  pending: { label: '대기', variant: 'secondary' as const },
  failed: { label: '실패', variant: 'destructive' as const },
};

export const RecentPayments: React.FC = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>최근 결제</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{payment.user}</p>
                <p className="text-xs text-muted-foreground">{payment.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusMap[payment.status].variant}>
                  {statusMap[payment.status].label}
                </Badge>
                <span className="text-sm font-semibold">₩{payment.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPayments;
