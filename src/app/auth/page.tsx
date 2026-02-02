'use client';

import React from 'react';
import { LoginForm } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { TrendingUp } from 'lucide-react';

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
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Quant Jump Stock</span>
        </div>

        <div>
          <h1 className="mb-4 text-4xl font-bold text-white">
            주식 종목 추천 &<br />
            자동 매매 시스템
          </h1>
          <p className="text-lg text-slate-400">
            AI 기반 퀀트 분석으로 최적의 투자 전략을 제공하는
            <br />
            관리자 백오피스 시스템입니다.
          </p>
        </div>

        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Quant Jump Stock. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-8 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">QJS Admin</span>
          </div>

          <LoginForm onSuccess={handleAuthSuccess} />
        </div>
      </div>
    </div>
  );
}
