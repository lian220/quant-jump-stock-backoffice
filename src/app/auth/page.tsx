'use client';

import React from 'react';
import { LoginForm } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BarChart3, Shield, Zap, TrendingUp } from 'lucide-react';

export default function AuthPage() {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 lg:flex">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Image
              src="/main_logo.png"
              alt="Alpha Foundry Logo"
              width={48}
              height={48}
              className="rounded-2xl"
            />
            <div>
              <span className="text-2xl font-bold text-white">Alpha Foundry</span>
              <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                Admin
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-white">
              AI 기반
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                퀀트 트레이딩
              </span>
              <br />
              관리 시스템
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-slate-400">
              실시간 시장 데이터 분석, 머신러닝 기반 종목 추천, 자동 매매 시스템을 한 곳에서
              관리하세요.
            </p>
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BarChart3, label: '실시간 분석', desc: '시장 데이터 모니터링' },
              { icon: Zap, label: 'AI 추천', desc: '머신러닝 기반 예측' },
              { icon: TrendingUp, label: '자동 매매', desc: '알고리즘 트레이딩' },
              { icon: Shield, label: '리스크 관리', desc: '포트폴리오 보호' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm"
              >
                <feature.icon className="mb-2 h-6 w-6 text-emerald-400" />
                <p className="font-semibold text-white">{feature.label}</p>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} Alpha Foundry</p>
          <div className="flex gap-4">
            <span className="text-sm text-slate-500 hover:text-slate-400 cursor-pointer">
              이용약관
            </span>
            <span className="text-sm text-slate-500 hover:text-slate-400 cursor-pointer">
              개인정보처리방침
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-6 py-12 lg:w-[45%]">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="mb-10 flex flex-col items-center gap-4 lg:hidden">
            <Image
              src="/main_logo.png"
              alt="Alpha Foundry Logo"
              width={56}
              height={56}
              className="rounded-2xl"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900">Alpha Foundry</h1>
              <p className="text-sm text-slate-500">관리자 로그인</p>
            </div>
          </div>

          <LoginForm onSuccess={handleAuthSuccess} />
        </div>
      </div>
    </div>
  );
}
