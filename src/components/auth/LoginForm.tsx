'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthFormData } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    userId: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.userId || !formData.password) {
      setError('아이디와 비밀번호를 입력해주세요');
      return;
    }

    const result = await signIn(formData.userId, formData.password);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess?.();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full">
      {/* Header - Desktop only */}
      <div className="mb-8 hidden lg:block">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">로그인</h2>
        <p className="mt-2 text-slate-500">관리자 계정으로 시스템에 접속하세요</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="userId" className="text-sm font-medium text-slate-700">
            아이디
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              placeholder="관리자 아이디를 입력하세요"
              disabled={loading}
              autoComplete="username"
              required
              className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-base shadow-sm transition-all focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-slate-700">
            비밀번호
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              disabled={loading}
              autoComplete="current-password"
              required
              className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-base shadow-sm transition-all focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/40 disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              로그인 중...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              로그인
              <ArrowRight className="h-5 w-5" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-center text-sm text-slate-500">
          관리자 계정이 필요하신가요?
          <br />
          <span className="font-medium text-slate-700">시스템 관리자에게 문의하세요</span>
        </p>
      </div>
    </div>
  );
};
