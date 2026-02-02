'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 매출 데이터
const revenueData = [
  { month: '1월', revenue: 4200000, users: 120 },
  { month: '2월', revenue: 3800000, users: 98 },
  { month: '3월', revenue: 5100000, users: 150 },
  { month: '4월', revenue: 4700000, users: 130 },
  { month: '5월', revenue: 6200000, users: 180 },
  { month: '6월', revenue: 5800000, users: 160 },
  { month: '7월', revenue: 7500000, users: 220 },
  { month: '8월', revenue: 8200000, users: 250 },
  { month: '9월', revenue: 7800000, users: 230 },
  { month: '10월', revenue: 9100000, users: 280 },
  { month: '11월', revenue: 8500000, users: 260 },
  { month: '12월', revenue: 10200000, users: 320 },
];

// 플랜별 분포
const planData = [
  { name: 'Free', value: 1200, color: '#94a3b8' },
  { name: 'Basic', value: 850, color: '#60a5fa' },
  { name: 'Premium', value: 420, color: '#a78bfa' },
  { name: 'Enterprise', value: 80, color: '#f472b6' },
];

// 일별 활성 사용자
const dailyActiveData = [
  { day: '월', active: 1200, new: 45 },
  { day: '화', active: 1350, new: 52 },
  { day: '수', active: 1180, new: 38 },
  { day: '목', active: 1420, new: 61 },
  { day: '금', active: 1580, new: 73 },
  { day: '토', active: 890, new: 28 },
  { day: '일', active: 720, new: 22 },
];

// 결제 수단별 통계
const paymentMethodData = [
  { method: '신용카드', count: 450, amount: 42000000 },
  { method: '카카오페이', count: 320, amount: 28000000 },
  { method: '토스페이', count: 180, amount: 15000000 },
  { method: '계좌이체', count: 90, amount: 12000000 },
];

// 전환율 데이터
const conversionData = [
  { stage: '방문', value: 10000 },
  { stage: '회원가입', value: 3200 },
  { stage: '무료체험', value: 1800 },
  { stage: '유료전환', value: 450 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('year');

  const stats = {
    totalRevenue: 81100000,
    revenueChange: 12.5,
    totalUsers: 2550,
    usersChange: 8.3,
    avgOrderValue: 65000,
    avgOrderChange: 3.2,
    conversionRate: 4.5,
    conversionChange: -0.8,
  };

  return (
    <>
      <Header title="통계" />

      <div className="p-6">
        {/* Period Selector */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">기간 선택</span>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">최근 7일</SelectItem>
              <SelectItem value="month">최근 30일</SelectItem>
              <SelectItem value="quarter">최근 3개월</SelectItem>
              <SelectItem value="year">최근 1년</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 매출</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩{formatCurrency(stats.totalRevenue)}</div>
              <div className="mt-1 flex items-center text-sm">
                {stats.revenueChange > 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span className={stats.revenueChange > 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(stats.revenueChange)}%
                </span>
                <span className="ml-1 text-muted-foreground">전년 대비</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 사용자</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-sm">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">{stats.usersChange}%</span>
                <span className="ml-1 text-muted-foreground">전년 대비</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                평균 결제액
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩{stats.avgOrderValue.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-sm">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">{stats.avgOrderChange}%</span>
                <span className="ml-1 text-muted-foreground">전년 대비</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">전환율</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <div className="mt-1 flex items-center text-sm">
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">{Math.abs(stats.conversionChange)}%</span>
                <span className="ml-1 text-muted-foreground">전년 대비</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>매출 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`₩${value.toLocaleString()}`, '매출']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>사용자 증가 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      name="신규 가입"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          {/* Plan Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>플랜별 사용자 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {planData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()}명`, '사용자']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Active Users */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>일별 활성 사용자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyActiveData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="active"
                      name="활성 사용자"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="new"
                      name="신규 가입"
                      fill="hsl(var(--primary) / 0.5)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>결제 수단별 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodData.map((item) => (
                  <div key={item.method} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-24 font-medium">{item.method}</div>
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(item.count / paymentMethodData[0].count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₩{formatCurrency(item.amount)}</div>
                      <div className="text-sm text-muted-foreground">{item.count}건</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>전환 퍼널</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionData.map((item, index) => {
                  const prevValue = index > 0 ? conversionData[index - 1].value : item.value;
                  const conversionRate =
                    index > 0 ? ((item.value / prevValue) * 100).toFixed(1) : 100;
                  const widthPercent = (item.value / conversionData[0].value) * 100;

                  return (
                    <div key={item.stage}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium">{item.stage}</span>
                        <div className="text-right">
                          <span className="font-medium">{item.value.toLocaleString()}</span>
                          {index > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({conversionRate}%)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-8 overflow-hidden rounded bg-muted">
                        <div
                          className="flex h-full items-center justify-center bg-primary text-xs font-medium text-primary-foreground"
                          style={{ width: `${widthPercent}%` }}
                        >
                          {widthPercent > 20 && `${widthPercent.toFixed(0)}%`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
