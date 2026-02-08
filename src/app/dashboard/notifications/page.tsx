'use client';

import { Header } from '@/components/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <>
      <Header title="알림 관리" />
      <div
        className="flex items-center justify-center p-6"
        style={{ minHeight: 'calc(100vh - 120px)' }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <Construction className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">알림 관리</h2>
              <p className="mt-1 text-sm text-muted-foreground">이 기능은 현재 준비 중입니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
