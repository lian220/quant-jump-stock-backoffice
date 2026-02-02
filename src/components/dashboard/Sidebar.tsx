'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  LineChart,
  Settings,
  Bell,
  Database,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: '대시보드', href: '/dashboard' },
  { icon: Users, label: '회원 관리', href: '/dashboard/users' },
  { icon: TrendingUp, label: '종목 추천', href: '/dashboard/recommendations' },
  { icon: LineChart, label: '분석 현황', href: '/dashboard/analytics' },
  { icon: Bell, label: '알림 관리', href: '/dashboard/notifications' },
  { icon: Database, label: '데이터 관리', href: '/dashboard/data' },
  { icon: Settings, label: '설정', href: '/dashboard/settings' },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Quant Jump</h1>
            <p className="text-xs text-slate-500">Admin Console</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            메뉴
          </p>
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(`${item.href}/`));
            const isExactDashboard = item.href === '/dashboard' && pathname === '/dashboard';
            const active = isActive || isExactDashboard;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white',
                )}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                    active
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white',
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-4 w-4 text-emerald-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-slate-800 p-4">
          <div className="mb-4 rounded-xl bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                <span className="text-sm font-bold">
                  {user?.name?.charAt(0) || user?.userId?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name || user?.userId}
                </p>
                <p className="truncate text-xs text-emerald-400">{user?.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
