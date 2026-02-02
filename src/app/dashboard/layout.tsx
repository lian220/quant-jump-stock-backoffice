'use client';

import React from 'react';
import { Sidebar } from '@/components/dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <main className="pl-64">{children}</main>
    </div>
  );
}
