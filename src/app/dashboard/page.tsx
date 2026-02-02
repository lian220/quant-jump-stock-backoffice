'use client';

import React from 'react';
import { Users, TrendingUp, LineChart, AlertTriangle, ArrowUpRight, Activity } from 'lucide-react';
import { Header, StatCard } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <>
      <Header title="대시보드" />

      <div className="p-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="총 회원수"
            value="1,234"
            change={12.5}
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatCard
            title="오늘 추천 종목"
            value="15"
            change={20.0}
            icon={TrendingUp}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-100"
          />
          <StatCard
            title="활성 분석"
            value="42"
            change={5.3}
            icon={LineChart}
            iconColor="text-violet-600"
            iconBgColor="bg-violet-100"
          />
          <StatCard
            title="미처리 알림"
            value="8"
            change={-25.0}
            icon={AlertTriangle}
            iconColor="text-amber-600"
            iconBgColor="bg-amber-100"
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Recent Recommendations */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">최근 추천 종목</h2>
                <p className="text-sm text-slate-500">AI 분석 기반 종목 추천</p>
              </div>
              <button className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200">
                전체보기
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { code: '005930', name: '삼성전자', action: '매수', score: 85, change: '+2.3%' },
                { code: '000660', name: 'SK하이닉스', action: '매수', score: 78, change: '+1.8%' },
                { code: '035420', name: 'NAVER', action: '관망', score: 65, change: '-0.5%' },
                { code: '035720', name: '카카오', action: '매도', score: 42, change: '-1.2%' },
                { code: '051910', name: 'LG화학', action: '매수', score: 72, change: '+0.8%' },
              ].map((stock, idx) => (
                <div
                  key={stock.code}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{stock.name}</p>
                      <p className="text-sm text-slate-500">{stock.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-medium ${
                        stock.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {stock.change}
                    </span>
                    <span
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        stock.action === '매수'
                          ? 'bg-emerald-100 text-emerald-700'
                          : stock.action === '매도'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {stock.action}
                    </span>
                    <div className="flex h-9 w-14 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                      {stock.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">시스템 상태</h2>
                <p className="text-sm text-slate-500">서비스 모니터링</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
                <Activity className="h-4 w-4" />
                정상 운영 중
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: '데이터 수집 서비스',
                  status: 'active',
                  lastRun: '5분 전',
                  uptime: '99.9%',
                },
                { name: 'ML 분석 엔진', status: 'active', lastRun: '10분 전', uptime: '99.8%' },
                { name: '알림 발송 서비스', status: 'active', lastRun: '1분 전', uptime: '100%' },
                { name: '배치 스케줄러', status: 'warning', lastRun: '30분 전', uptime: '98.5%' },
                { name: '경제지표 수집', status: 'active', lastRun: '1시간 전', uptime: '99.7%' },
              ].map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          service.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {service.status === 'active' && (
                        <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-emerald-500 opacity-50" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{service.name}</p>
                      <p className="text-sm text-slate-500">마지막 실행: {service.lastRun}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{service.uptime}</p>
                    <p className="text-xs text-slate-500">가동률</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
