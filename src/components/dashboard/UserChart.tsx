'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { month: '1월', newUsers: 120, activeUsers: 240 },
  { month: '2월', newUsers: 98, activeUsers: 198 },
  { month: '3월', newUsers: 150, activeUsers: 320 },
  { month: '4월', newUsers: 130, activeUsers: 278 },
  { month: '5월', newUsers: 180, activeUsers: 389 },
  { month: '6월', newUsers: 160, activeUsers: 349 },
  { month: '7월', newUsers: 200, activeUsers: 430 },
];

export const UserChart: React.FC = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>사용자 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar
                dataKey="newUsers"
                name="신규 가입"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="activeUsers"
                name="활성 사용자"
                fill="hsl(var(--primary) / 0.5)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserChart;
