'use client';

import React from 'react';
import { Bell, Search, Calendar, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/contexts/SidebarContext';

interface HeaderProps {
  title: string;
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const { openMobile } = useSidebar();

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:h-20 md:px-8">
        <div className="flex items-center gap-3">
          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={openMobile}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            aria-label="메뉴 열기"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900 md:text-2xl">{title}</h1>
            {description ? (
              <p className="mt-1 hidden text-sm text-slate-500 sm:block">{description}</p>
            ) : (
              <div className="mt-1 hidden items-center gap-2 text-sm text-slate-500 sm:flex">
                <Calendar className="h-4 w-4" />
                {today}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Search */}
          <div className="relative hidden lg:block">
            <label htmlFor="global-search" className="sr-only">
              종목, 사용자 통합 검색
            </label>
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              id="global-search"
              type="search"
              placeholder="종목, 사용자 검색..."
              aria-label="종목, 사용자 통합 검색"
              className="h-11 w-72 rounded-xl border-slate-200 bg-slate-50 pl-11 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="알림 보기 (미확인 알림 있음)"
            className="relative h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 md:h-11 md:w-11"
          >
            <Bell className="h-5 w-5 text-slate-600" aria-hidden="true" />
            <span
              className="absolute right-2 top-2 flex h-2.5 w-2.5 md:right-2.5 md:top-2.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
