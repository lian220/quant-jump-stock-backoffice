'use client';

import React from 'react';
import { DollarSign, Users, CreditCard, TrendingUp } from 'lucide-react';
import { Header, StatCard, RevenueChart, UserChart, RecentPayments } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <>
      <Header title="대시보드" />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="총 매출"
            value="₩35,000,000"
            change={12.5}
            icon={DollarSign}
            iconColor="text-green-500"
          />
          <StatCard
            title="총 사용자"
            value="2,350"
            change={8.2}
            icon={Users}
            iconColor="text-blue-500"
          />
          <StatCard
            title="이번 달 결제"
            value="₩7,200,000"
            change={-3.1}
            icon={CreditCard}
            iconColor="text-purple-500"
          />
          <StatCard
            title="전환율"
            value="4.3%"
            change={1.2}
            icon={TrendingUp}
            iconColor="text-orange-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="mb-6 grid gap-4 md:grid-cols-7">
          <RevenueChart />
          <UserChart />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-7">
          <div className="col-span-4">
            <RevenueChart />
          </div>
          <RecentPayments />
        </div>
      </div>
    </>
  );
}
