'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getStrategyDetail,
  updateStrategy,
  type UpdateStrategyRequest,
  type StrategyDetailResponse,
  type StrategyStatus,
  type RebalanceFrequency,
  categoryOptions,
  rebalanceOptions,
  statusLabels,
} from '@/lib/api';

// 상태 옵션 (수정 가능한 상태만)
const statusOptions: { code: StrategyStatus; name: string }[] = [
  { code: 'DRAFT', name: '초안' },
  { code: 'PENDING_REVIEW', name: '검토 대기' },
  { code: 'ARCHIVED', name: '보관됨' },
];

export default function EditStrategyPage() {
  const params = useParams();
  const router = useRouter();
  const strategyId = Number(params.id);

  const [strategy, setStrategy] = useState<StrategyDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState<UpdateStrategyRequest>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadStrategy = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getStrategyDetail(strategyId);
      setStrategy(data);
      // 폼 초기값 설정
      setFormData({
        name: data.name,
        description: data.description || '',
        categoryCode: data.category.code,
        isPublic: data.isPublic,
        isPremium: data.isPremium,
        status: data.status as StrategyStatus,
        conditions: data.conditions,
        rebalanceFrequency: data.rebalanceFrequency as RebalanceFrequency,
      });
    } catch (err) {
      console.error('전략 조회 실패:', err);
      setError(err instanceof Error ? err.message : '전략을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [strategyId]);

  useEffect(() => {
    loadStrategy();
  }, [loadStrategy]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.name !== undefined && !formData.name.trim()) {
      newErrors.name = '전략 이름은 필수입니다.';
    }

    // JSON 형식 검증
    if (formData.conditions) {
      try {
        JSON.parse(formData.conditions);
      } catch {
        newErrors.conditions = '올바른 JSON 형식이 아닙니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    try {
      const response = await updateStrategy(strategyId, formData);
      if (response.success) {
        alert('전략이 수정되었습니다.');
        router.push(`/dashboard/strategies/${strategyId}`);
      } else {
        alert(response.message || '전략 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('전략 수정 실패:', err);
      alert('전략 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Header title="전략 수정" />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </>
    );
  }

  // 에러 상태
  if (error || !strategy) {
    return (
      <>
        <Header title="전략 수정" />
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-500">{error || '전략을 찾을 수 없습니다.'}</p>
          <div className="flex gap-2">
            <Button onClick={loadStrategy} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <Button onClick={() => router.push('/dashboard/strategies')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="전략 수정" />

      <div className="p-6">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Link
            href={`/dashboard/strategies/${strategyId}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            전략 상세로 돌아가기
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 기본 정보 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 전략 이름 */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      전략 이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="예: 모멘텀 기반 성장주 전략"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  {/* 설명 */}
                  <div className="space-y-2">
                    <Label htmlFor="description">전략 설명</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="전략에 대한 상세 설명을 입력하세요..."
                      rows={4}
                    />
                  </div>

                  {/* 카테고리 */}
                  <div className="space-y-2">
                    <Label>카테고리</Label>
                    <Select
                      value={formData.categoryCode}
                      onValueChange={(value) => setFormData({ ...formData, categoryCode: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat.code} value={cat.code}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 리밸런싱 주기 */}
                  <div className="space-y-2">
                    <Label>리밸런싱 주기</Label>
                    <Select
                      value={formData.rebalanceFrequency}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          rebalanceFrequency: value as RebalanceFrequency,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="리밸런싱 주기 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {rebalanceOptions.map((opt) => (
                          <SelectItem key={opt.code} value={opt.code}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* 전략 조건 */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>전략 조건 (JSON)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Textarea
                      value={formData.conditions || ''}
                      onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                      placeholder='{"indicators": ["RSI", "MACD"], "thresholds": {}}'
                      rows={10}
                      className={`font-mono ${errors.conditions ? 'border-red-500' : ''}`}
                    />
                    {errors.conditions && (
                      <p className="text-sm text-red-500">{errors.conditions}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      전략 실행에 사용될 조건을 JSON 형식으로 입력하세요.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 설정 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 상태 */}
                  <div className="space-y-2">
                    <Label>상태</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value as StrategyStatus })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.code} value={opt.code}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      현재 상태: {statusLabels[strategy.status as StrategyStatus]}
                    </p>
                  </div>

                  {/* 공개 여부 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPublic">공개 전략</Label>
                      <p className="text-sm text-muted-foreground">마켓플레이스에 공개됩니다</p>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                    />
                  </div>

                  {/* 프리미엄 여부 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPremium">프리미엄 전략</Label>
                      <p className="text-sm text-muted-foreground">유료 구독이 필요합니다</p>
                    </div>
                    <Switch
                      id="isPremium"
                      checked={formData.isPremium}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPremium: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 저장 버튼 */}
              <div className="mt-6 flex flex-col gap-2">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  변경사항 저장
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/dashboard/strategies/${strategyId}`)}
                >
                  취소
                </Button>
              </div>

              {/* 전략 정보 */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">전략 정보</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div className="space-y-1">
                    <p>ID: {strategy.id}</p>
                    <p>구독자: {strategy.subscriberCount}명</p>
                    <p>
                      평점: {strategy.averageRating > 0 ? strategy.averageRating.toFixed(1) : '-'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
