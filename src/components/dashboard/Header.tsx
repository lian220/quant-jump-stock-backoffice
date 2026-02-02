'use client';

import React from 'react';
import { Bell, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-20 items-center justify-between px-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : (
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              {today}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="종목, 회원 검색..."
              className="h-11 w-72 rounded-xl border-slate-200 bg-slate-50 pl-11 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-11 w-11 rounded-xl bg-slate-50 hover:bg-slate-100"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
