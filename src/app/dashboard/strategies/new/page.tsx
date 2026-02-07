'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';
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
  createStrategy,
  type CreateStrategyRequest,
  type RebalanceFrequency,
  type StockSelectionType,
  type PortfolioItem,
  categoryOptions,
  rebalanceOptions,
  stockSelectionTypeOptions,
} from '@/lib/api';

export default function NewStrategyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState<CreateStrategyRequest>({
    name: '',
    description: '',
    categoryCode: 'MOMENTUM',
    isPublic: false,
    isPremium: false,
    conditions: '{}',
    rebalanceFrequency: 'MONTHLY',
    stockSelectionType: 'SCREENING',
    investmentPhilosophy: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 포트폴리오 종목 상태
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    { id: crypto.randomUUID(), assetClass: '', name: '', ticker: '', weight: 0 },
  ]);

  // 포트폴리오 종목 → conditions JSON 동기화
  useEffect(() => {
    if (formData.stockSelectionType !== 'PORTFOLIO') return;
    const allocation: Record<string, { name: string; assetClass: string; weight: number }> = {};
    portfolioItems.forEach((item) => {
      if (item.ticker.trim()) {
        allocation[item.ticker.trim()] = {
          name: item.name,
          assetClass: item.assetClass,
          weight: item.weight,
        };
      }
    });
    setFormData((prev) => ({
      ...prev,
      conditions: JSON.stringify({ allocation }, null, 2),
    }));
  }, [portfolioItems, formData.stockSelectionType]);

  const addPortfolioItem = () => {
    setPortfolioItems([
      ...portfolioItems,
      { id: crypto.randomUUID(), assetClass: '', name: '', ticker: '', weight: 0 },
    ]);
  };

  const removePortfolioItem = (index: number) => {
    setPortfolioItems(portfolioItems.filter((_, i) => i !== index));
  };

  const updatePortfolioItem = (
    index: number,
    field: keyof PortfolioItem,
    value: string | number,
  ) => {
    setPortfolioItems(
      portfolioItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const totalWeight = portfolioItems.reduce((sum, item) => sum + item.weight, 0);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '전략 이름은 필수입니다.';
    }

    if (!formData.categoryCode) {
      newErrors.categoryCode = '카테고리를 선택해주세요.';
    }

    // JSON 형식 검증
    try {
      JSON.parse(formData.conditions || '{}');
    } catch {
      newErrors.conditions = '올바른 JSON 형식이 아닙니다.';
    }

    // 포트폴리오 비중 합계 검증
    if (formData.stockSelectionType === 'PORTFOLIO') {
      if (Math.abs(totalWeight - 100) >= 0.01) {
        newErrors.portfolio = '포트폴리오 비중 합계가 100%여야 합니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await createStrategy(formData);
      if (response.success && response.strategyId) {
        alert('전략이 생성되었습니다.');
        router.push(`/dashboard/strategies/${response.strategyId}`);
      } else {
        alert(response.message || '전략 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('전략 생성 실패:', err);
      alert('전략 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="전략 등록" />

      <div className="p-6">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Link
            href="/dashboard/strategies"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            전략 목록으로 돌아가기
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
                      value={formData.name}
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
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="전략에 대한 상세 설명을 입력하세요..."
                      rows={4}
                    />
                  </div>

                  {/* 카테고리 */}
                  <div className="space-y-2">
                    <Label>
                      카테고리 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.categoryCode}
                      onValueChange={(value) => setFormData({ ...formData, categoryCode: value })}
                    >
                      <SelectTrigger className={errors.categoryCode ? 'border-red-500' : ''}>
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
                    {errors.categoryCode && (
                      <p className="text-sm text-red-500">{errors.categoryCode}</p>
                    )}
                  </div>

                  {/* 종목선정 방식 */}
                  <div className="space-y-2">
                    <Label>종목선정 방식</Label>
                    <Select
                      value={formData.stockSelectionType}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          stockSelectionType: value as StockSelectionType,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="종목선정 방식 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {stockSelectionTypeOptions.map((opt) => (
                          <SelectItem key={opt.code} value={opt.code}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      스크리닝: 조건으로 종목 필터링 / 포트폴리오: 고정 종목 구성
                    </p>
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

                  {/* 투자 철학 */}
                  <div className="space-y-2">
                    <Label htmlFor="investmentPhilosophy">투자 철학</Label>
                    <Textarea
                      id="investmentPhilosophy"
                      value={formData.investmentPhilosophy}
                      onChange={(e) =>
                        setFormData({ ...formData, investmentPhilosophy: e.target.value })
                      }
                      placeholder="AI 매매 판단 시 참고할 투자 철학을 입력하세요..."
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      AI가 매매 판단 시 참고하는 투자 철학입니다.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 전략 조건 / 포트폴리오 구성 */}
              {formData.stockSelectionType === 'PORTFOLIO' ? (
                <Card className="mt-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>포트폴리오 구성</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={addPortfolioItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      종목 추가
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {portfolioItems.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <Input
                            placeholder="자산군"
                            value={item.assetClass}
                            onChange={(e) =>
                              updatePortfolioItem(index, 'assetClass', e.target.value)
                            }
                            className="w-28"
                          />
                          <Input
                            placeholder="종목명"
                            value={item.name}
                            onChange={(e) => updatePortfolioItem(index, 'name', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="티커"
                            value={item.ticker}
                            onChange={(e) => updatePortfolioItem(index, 'ticker', e.target.value)}
                            className="w-28 font-mono"
                          />
                          <Input
                            type="number"
                            placeholder="비중(%)"
                            value={item.weight || ''}
                            onChange={(e) =>
                              updatePortfolioItem(index, 'weight', parseFloat(e.target.value) || 0)
                            }
                            className="w-24 text-right"
                            min={0}
                            max={100}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePortfolioItem(index)}
                            disabled={portfolioItems.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`mt-3 text-right text-sm font-semibold ${Math.abs(totalWeight - 100) < 0.01 ? 'text-green-600' : 'text-orange-500'}`}
                    >
                      합계: {totalWeight.toFixed(2)}%
                      {Math.abs(totalWeight - 100) >= 0.01 && ' (100%가 되어야 합니다)'}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>전략 조건 (JSON)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Textarea
                        value={formData.conditions}
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
              )}
            </div>

            {/* 설정 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  전략 등록
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/dashboard/strategies')}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
