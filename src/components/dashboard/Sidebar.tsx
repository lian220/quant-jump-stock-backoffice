'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
  ChevronDown,
  CreditCard,
  Target,
  BarChart3,
  Newspaper,
  FileText,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

interface SubItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: '대시보드', href: '/dashboard' },
  { icon: Users, label: '회원 관리', href: '/dashboard/users' },
  { icon: Target, label: '전략 관리', href: '/dashboard/strategies' },
  { icon: BarChart3, label: '종목 관리', href: '/dashboard/stocks' },
  { icon: TrendingUp, label: '종목 추천', href: '/dashboard/recommendations' },
  { icon: LineChart, label: '분석 현황', href: '/dashboard/analytics' },
  { icon: CreditCard, label: '결제 관리', href: '/dashboard/payments' },
  {
    icon: Newspaper,
    label: '뉴스 관리',
    href: '/dashboard/news',
    subItems: [
      { label: '뉴스 목록', href: '/dashboard/news', icon: FileText },
      { label: '카테고리 관리', href: '/dashboard/news-categories', icon: FolderOpen },
    ],
  },
  { icon: Bell, label: '알림 관리', href: '/dashboard/notifications' },
  { icon: Database, label: '데이터 관리', href: '/dashboard/data' },
  { icon: Settings, label: '설정', href: '/dashboard/settings' },
];

/** 사이드바 내부 콘텐츠 (데스크톱/모바일 공용) */
const SidebarContent: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isNewsPath = pathname?.startsWith('/dashboard/news');
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(
    isNewsPath ? '/dashboard/news' : null,
  );

  useEffect(() => {
    if (isNewsPath) {
      setOpenSubMenu('/dashboard/news');
    }
  }, [isNewsPath]);

  const toggleSubMenu = (href: string) => {
    setOpenSubMenu((prev) => (prev === href ? null : href));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 px-6">
        <Image
          src="/main_logo.png"
          alt="Alpha Foundry Logo"
          width={44}
          height={44}
          className="rounded-xl"
        />
        <div>
          <h1 className="text-lg font-bold text-white">Alpha Foundry</h1>
          <p className="text-xs text-slate-500">Admin Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          메뉴
        </p>
        {menuItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isSubMenuOpen = openSubMenu === item.href;

          const isActive = hasSubItems
            ? item.subItems!.some(
                (sub) => pathname === sub.href || pathname?.startsWith(`${sub.href}/`),
              )
            : pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(`${item.href}/`));
          const isExactDashboard = item.href === '/dashboard' && pathname === '/dashboard';
          const active = isActive || isExactDashboard;

          if (hasSubItems) {
            return (
              <div key={item.href}>
                <button
                  onClick={() => toggleSubMenu(item.href)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
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
                  <span className="flex-1 text-left">{item.label}</span>
                  {isSubMenuOpen ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                {isSubMenuOpen && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-slate-700 pl-3">
                    {item.subItems!.map((sub) => {
                      const subActive =
                        pathname === sub.href ||
                        (sub.href === '/dashboard/news' && pathname === '/dashboard/news') ||
                        (sub.href !== '/dashboard/news' && pathname?.startsWith(`${sub.href}/`));

                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onNavigate}
                          className={cn(
                            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                            subActive
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300',
                          )}
                        >
                          <sub.icon className="h-4 w-4" />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
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
  );
};

/** 메인 사이드바 컴포넌트 (데스크톱: 고정, 모바일: Sheet 드로어) */
export const Sidebar: React.FC = () => {
  const { mobileOpen, closeMobile } = useSidebar();
  const pathname = usePathname();

  // 페이지 이동 시 모바일 사이드바 자동 닫기
  useEffect(() => {
    closeMobile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* 데스크톱 사이드바: md 이상에서만 표시 */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 md:block">
        <SidebarContent />
      </aside>

      {/* 모바일 사이드바: Sheet 드로어 */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && closeMobile()}>
        <SheetContent
          side="left"
          className="w-72 border-none bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-0"
        >
          <SheetTitle className="sr-only">네비게이션 메뉴</SheetTitle>
          <SidebarContent onNavigate={closeMobile} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
