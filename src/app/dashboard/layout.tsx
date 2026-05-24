'use client';

import React from 'react';
import { Sidebar } from '@/components/dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-slate-50"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p className="text-sm text-slate-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect('/auth');
  }

  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        본문으로 건너뛰기
      </a>
      <div className="min-h-screen bg-slate-100">
        <Sidebar />
        <main id="main-content" className="md:pl-72">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
