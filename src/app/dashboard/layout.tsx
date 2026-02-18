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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
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
      <div className="min-h-screen bg-slate-100">
        <Sidebar />
        <main className="md:pl-72">{children}</main>
      </div>
    </SidebarProvider>
  );
}
