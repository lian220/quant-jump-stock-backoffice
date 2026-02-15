'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle, RefreshCw, Plus, Trash2, Info } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  getStrategyDetail,
  updateStrategy,
  type UpdateStrategyRequest,
  type StrategyDetailResponse,
  type StrategyStatus,
  type RebalanceFrequency,
  type StockSelectionType,
  type PortfolioItem,
  categoryOptions,
  rebalanceOptions,
  stockSelectionTypeOptions,
  statusLabels,
} from '@/lib/api';

// 용어 설명 툴팁 컴포넌트
function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="inline-block w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help ml-1 shrink-0" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

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

  // 리스크 설정 상태
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [stopLossValue, setStopLossValue] = useState(5);
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [takeProfitValue, setTakeProfitValue] = useState(10);
  const [trailingStopEnabled, setTrailingStopEnabled] = useState(false);
  const [trailingStopValue, setTrailingStopValue] = useState(3);

  // 포지션 사이징 상태
  const [positionMethod, setPositionMethod] = useState('FIXED_PERCENTAGE');
  const [maxPositionPct, setMaxPositionPct] = useState(20);
  const [maxPositions, setMaxPositions] = useState(10);

  // 거래 비용 상태
  const [commissionRate, setCommissionRate] = useState(0.015);
  const [taxRate, setTaxRate] = useState(0.23);
  const [slippageModel, setSlippageModel] = useState('FIXED');
  const [baseSlippage, setBaseSlippage] = useState(0.1);

  // 포트폴리오 종목 상태
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    { id: crypto.randomUUID(), assetClass: '', name: '', ticker: '', weight: 0 },
  ]);

  // 리스크 설정 → formData JSON 동기화
  useEffect(() => {
    const rs: Record<string, unknown> = {};
    if (stopLossEnabled) rs.stopLoss = { enabled: true, percentage: stopLossValue };
    if (takeProfitEnabled) rs.takeProfit = { enabled: true, percentage: takeProfitValue };
    if (trailingStopEnabled) rs.trailingStop = { enabled: true, percentage: trailingStopValue };
    setFormData((prev) => ({ ...prev, riskSettings: JSON.stringify(rs) }));
  }, [
    stopLossEnabled,
    stopLossValue,
    takeProfitEnabled,
    takeProfitValue,
    trailingStopEnabled,
    trailingStopValue,
  ]);

  useEffect(() => {
    const ps = { method: positionMethod, maxPositionPct, maxPositions };
    setFormData((prev) => ({ ...prev, positionSizing: JSON.stringify(ps) }));
  }, [positionMethod, maxPositionPct, maxPositions]);

  useEffect(() => {
    const tc = { commissionRate, taxRate, slippageModel, baseSlippage };
    setFormData((prev) => ({ ...prev, tradingCosts: JSON.stringify(tc) }));
  }, [commissionRate, taxRate, slippageModel, baseSlippage]);

  // PORTFOLIO → SCREENING 전환 시 stale conditions 초기화
  useEffect(() => {
    if (formData.stockSelectionType !== 'PORTFOLIO' && strategy) {
      setFormData((prev) => ({ ...prev, conditions: '{}' }));
    }
  }, [formData.stockSelectionType, strategy]);

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
        stockSelectionType: data.stockSelectionType as StockSelectionType,
        investmentPhilosophy: data.investmentPhilosophy || '',
      });

      // 리스크 설정 초기값 로드
      if (data.riskSettings && data.riskSettings !== '{}') {
        try {
          const rs = JSON.parse(data.riskSettings);
          if (rs.stopLoss?.enabled) {
            setStopLossEnabled(true);
            setStopLossValue(rs.stopLoss.percentage ?? 5);
          }
          if (rs.takeProfit?.enabled) {
            setTakeProfitEnabled(true);
            setTakeProfitValue(rs.takeProfit.percentage ?? 10);
          }
          if (rs.trailingStop?.enabled) {
            setTrailingStopEnabled(true);
            setTrailingStopValue(rs.trailingStop.percentage ?? 3);
          }
        } catch {
          /* ignore */
        }
      }
      if (data.positionSizing && data.positionSizing !== '{}') {
        try {
          const ps = JSON.parse(data.positionSizing);
          if (ps.method) setPositionMethod(ps.method);
          if (ps.maxPositionPct != null) setMaxPositionPct(ps.maxPositionPct);
          if (ps.maxPositions != null) setMaxPositions(ps.maxPositions);
        } catch {
          /* ignore */
        }
      }
      if (data.tradingCosts && data.tradingCosts !== '{}') {
        try {
          const tc = JSON.parse(data.tradingCosts);
          if (tc.commissionRate != null) setCommissionRate(tc.commissionRate);
          if (tc.taxRate != null) setTaxRate(tc.taxRate);
          if (tc.slippageModel) setSlippageModel(tc.slippageModel);
          if (tc.baseSlippage != null) setBaseSlippage(tc.baseSlippage);
        } catch {
          /* ignore */
        }
      }

      // 포트폴리오 초기값 로드
      if (data.stockSelectionType === 'PORTFOLIO' && data.conditions) {
        try {
          const parsed = JSON.parse(data.conditions);
          if (parsed.allocation && typeof parsed.allocation === 'object') {
            const items = Object.entries(parsed.allocation).map(
              ([ticker, info]: [string, unknown]) => {
                const d = info as {
                  name?: string;
                  assetClass?: string;
                  weight?: number;
                };
                return {
                  id: crypto.randomUUID(),
                  ticker,
                  name: d.name || ticker,
                  assetClass: d.assetClass || '',
                  weight: d.weight ?? 0,
                };
              },
            );
            if (items.length > 0) {
              setPortfolioItems(items);
            }
          }
        } catch {
          // conditions 파싱 실패 시 기본값 유지
        }
      }
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
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900"
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
                      value={formData.investmentPhilosophy || ''}
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
              )}
              {/* 백테스트 기본 리스크 설정 */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>백테스트 기본 리스크 설정</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    이 전략의 백테스트 실행 시 기본값으로 사용됩니다
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 리스크 설정 */}
                  <div>
                    <Label className="text-base font-semibold flex items-center">
                      리스크 관리
                      <InfoTip text="매매 시 손실을 제한하고 수익을 확정하기 위한 자동 매도 규칙입니다." />
                    </Label>
                    <div className="mt-3 grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2 rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="stopLoss" className="text-sm flex items-center">
                            손절 (Stop Loss)
                            <InfoTip text="매입가 대비 설정 비율만큼 하락하면 자동으로 매도하여 손실을 제한합니다." />
                          </Label>
                          <Switch
                            id="stopLoss"
                            checked={stopLossEnabled}
                            onCheckedChange={setStopLossEnabled}
                          />
                        </div>
                        {stopLossEnabled && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={stopLossValue}
                              onChange={(e) => setStopLossValue(parseFloat(e.target.value) || 0)}
                              className="w-20 text-right"
                              min={0}
                              max={50}
                              step={0.5}
                            />
                            <span className="text-sm text-muted-foreground">% 하락 시</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="takeProfit" className="text-sm flex items-center">
                            익절 (Take Profit)
                            <InfoTip text="매입가 대비 설정 비율만큼 상승하면 자동으로 매도하여 수익을 확정합니다." />
                          </Label>
                          <Switch
                            id="takeProfit"
                            checked={takeProfitEnabled}
                            onCheckedChange={setTakeProfitEnabled}
                          />
                        </div>
                        {takeProfitEnabled && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={takeProfitValue}
                              onChange={(e) => setTakeProfitValue(parseFloat(e.target.value) || 0)}
                              className="w-20 text-right"
                              min={0}
                              max={100}
                              step={0.5}
                            />
                            <span className="text-sm text-muted-foreground">% 상승 시</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="trailingStop" className="text-sm flex items-center">
                            트레일링 스탑
                            <InfoTip text="최고가 대비 설정 비율만큼 하락하면 매도합니다. 상승 추세를 추종하면서 수익을 보호합니다." />
                          </Label>
                          <Switch
                            id="trailingStop"
                            checked={trailingStopEnabled}
                            onCheckedChange={setTrailingStopEnabled}
                          />
                        </div>
                        {trailingStopEnabled && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={trailingStopValue}
                              onChange={(e) =>
                                setTrailingStopValue(parseFloat(e.target.value) || 0)
                              }
                              className="w-20 text-right"
                              min={0}
                              max={30}
                              step={0.5}
                            />
                            <span className="text-sm text-muted-foreground">% 추적</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 포지션 사이징 */}
                  <div>
                    <Label className="text-base font-semibold flex items-center">
                      포지션 사이징
                      <InfoTip text="한 종목에 투자할 금액 비율을 결정하는 방법입니다. 리스크 분산을 위해 적절한 포지션 크기 관리가 중요합니다." />
                    </Label>
                    <div className="mt-3 grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center">
                          사이징 방법
                          <InfoTip text="고정 비율: 자본의 일정 비율 투자 / 동일 비중: 모든 종목에 동일 금액 / 켈리 공식: 승률 기반 최적 비율 / 변동성 타겟: 목표 변동성에 맞춰 조절 / 리스크 패리티: 리스크 기여도 균등 배분" />
                        </Label>
                        <Select value={positionMethod} onValueChange={setPositionMethod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FIXED_PERCENTAGE">고정 비율</SelectItem>
                            <SelectItem value="EQUAL_WEIGHT">동일 비중</SelectItem>
                            <SelectItem value="KELLY">켈리 공식</SelectItem>
                            <SelectItem value="VOLATILITY_TARGET">변동성 타겟</SelectItem>
                            <SelectItem value="RISK_PARITY">리스크 패리티</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center">
                          최대 포지션 비율 (%)
                          <InfoTip text="총 자본 대비 한 종목에 투자할 수 있는 최대 비율입니다." />
                        </Label>
                        <Input
                          type="number"
                          value={maxPositionPct}
                          onChange={(e) => setMaxPositionPct(parseFloat(e.target.value) || 0)}
                          min={1}
                          max={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center">
                          최대 포지션 수
                          <InfoTip text="동시에 보유할 수 있는 최대 종목 수입니다." />
                        </Label>
                        <Input
                          type="number"
                          value={maxPositions}
                          onChange={(e) => setMaxPositions(parseInt(e.target.value) || 1)}
                          min={1}
                          max={50}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 거래 비용 */}
                  <div>
                    <Label className="text-base font-semibold flex items-center">
                      거래 비용
                      <InfoTip text="실제 거래 시 발생하는 수수료, 세금, 슬리피지를 반영하여 보다 현실적인 수익률을 계산합니다." />
                    </Label>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center">
                          수수료율 (%)
                          <InfoTip text="매매 시 증권사에 지불하는 수수료입니다. 국내 온라인 거래 기준 약 0.015%입니다." />
                        </Label>
                        <Input
                          type="number"
                          value={commissionRate}
                          onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                          min={0}
                          step={0.001}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center">
                          세금율 (%, 매도 시)
                          <InfoTip text="매도 시 부과되는 증권거래세입니다. 코스피 0.18%, 코스닥 0.23%가 일반적입니다." />
                        </Label>
                        <Input
                          type="number"
                          value={taxRate}
                          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          min={0}
                          step={0.01}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center">
                          슬리피지 모델
                          <InfoTip text="주문가와 실제 체결가의 차이입니다. 없음: 미적용 / 고정: 일정 비율 / 적응형: 거래량에 따라 변동" />
                        </Label>
                        <Select value={slippageModel} onValueChange={setSlippageModel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NONE">없음</SelectItem>
                            <SelectItem value="FIXED">고정</SelectItem>
                            <SelectItem value="ADAPTIVE">적응형</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {slippageModel !== 'NONE' && (
                        <div className="space-y-2">
                          <Label className="text-sm flex items-center">
                            기본 슬리피지 (%)
                            <InfoTip text="기본적으로 적용되는 슬리피지 비율입니다. 유동성이 낮은 종목일수록 슬리피지가 클 수 있습니다." />
                          </Label>
                          <Input
                            type="number"
                            value={baseSlippage}
                            onChange={(e) => setBaseSlippage(parseFloat(e.target.value) || 0)}
                            min={0}
                            step={0.01}
                          />
                        </div>
                      )}
                    </div>
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
