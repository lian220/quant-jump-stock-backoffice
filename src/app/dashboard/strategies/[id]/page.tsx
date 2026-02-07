'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Calendar,
  RefreshCw,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Crown,
} from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getStrategyDetail,
  deleteStrategy,
  getDefaultStocks,
  type StrategyDetailResponse,
  type StrategyStatus,
  type DefaultStockResponse,
  statusLabels,
  statusVariants,
  rebalanceOptions,
  stockSelectionTypeLabels,
  type StockSelectionType,
} from '@/lib/api';

// 카테고리 색상
const categoryColors: Record<string, string> = {
  VALUE: 'text-green-500',
  MOMENTUM: 'text-blue-500',
  ASSET_ALLOCATION: 'text-purple-500',
  QUANT_COMPOSITE: 'text-cyan-500',
  SEASONAL: 'text-orange-500',
  CUSTOM: 'text-slate-500',
  ML_PREDICTION: 'text-pink-500',
};

export default function StrategyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const strategyId = Number(params.id);

  const [strategy, setStrategy] = useState<StrategyDetailResponse | null>(null);
  const [defaultStocks, setDefaultStocks] = useState<DefaultStockResponse[]>([]);
  const [defaultStocksTotalWeight, setDefaultStocksTotalWeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadStrategy = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getStrategyDetail(strategyId);
      setStrategy(data);

      // PORTFOLIO 타입이면 기본 종목도 조회
      if (data.stockSelectionType === 'PORTFOLIO') {
        try {
          const stocksData = await getDefaultStocks(strategyId);
          setDefaultStocks(stocksData.stocks);
          setDefaultStocksTotalWeight(stocksData.totalWeight);
        } catch {
          // 기본 종목 조회 실패 시 빈 목록으로 처리
          setDefaultStocks([]);
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

  const handleDelete = async () => {
    if (!strategy) return;
    if (!confirm(`"${strategy.name}" 전략을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`))
      return;

    setDeleteLoading(true);
    try {
      const response = await deleteStrategy(strategyId);
      if (response.success) {
        alert('전략이 삭제되었습니다.');
        router.push('/dashboard/strategies');
      } else {
        alert(response.message || '삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRebalanceName = (code: string) => {
    return rebalanceOptions.find((r) => r.code === code)?.name || code;
  };

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Header title="전략 상세" />
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
        <Header title="전략 상세" />
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
      <Header title="전략 상세" />

      <div className="p-6">
        {/* 상단 네비게이션 */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard/strategies"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            전략 목록으로 돌아가기
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/strategies/${strategyId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                수정
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading || strategy.subscriberCount > 0}
              title={strategy.subscriberCount > 0 ? '구독자가 있는 전략은 삭제할 수 없습니다' : ''}
            >
              {deleteLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              삭제
            </Button>
          </div>
        </div>

        {/* 기본 정보 카드 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  {strategy.name}
                  {strategy.isPremium && <Crown className="h-5 w-5 text-yellow-500" />}
                </CardTitle>
                <p className="mt-1 text-muted-foreground">
                  <span className={categoryColors[strategy.category.code] || 'text-slate-400'}>
                    {strategy.category.name}
                  </span>
                  {' 전략 '}
                  {strategy.ownerName && `by ${strategy.ownerName}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariants[strategy.status as StrategyStatus]}>
                  {statusLabels[strategy.status as StrategyStatus]}
                </Badge>
                {strategy.isPublic ? (
                  <Badge variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    공개
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <EyeOff className="h-3 w-3" />
                    비공개
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-slate-600">{strategy.description || '설명이 없습니다.'}</p>

            {/* 통계 그리드 */}
            <div className="grid gap-4 md:grid-cols-5">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  구독자
                </div>
                <div className="mt-1 text-2xl font-bold text-emerald-500">
                  {strategy.subscriberCount}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  평균 평점
                </div>
                <div className="mt-1 text-2xl font-bold text-yellow-500">
                  {strategy.averageRating > 0 ? strategy.averageRating.toFixed(1) : '-'}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="text-sm text-muted-foreground">종목선정</div>
                <div className="mt-1 text-xl font-bold">
                  <Badge
                    variant={strategy.stockSelectionType === 'PORTFOLIO' ? 'default' : 'secondary'}
                  >
                    {stockSelectionTypeLabels[strategy.stockSelectionType as StockSelectionType] ||
                      strategy.stockSelectionType}
                  </Badge>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  리밸런싱
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {getRebalanceName(strategy.rebalanceFrequency)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  생성일
                </div>
                <div className="mt-1 text-sm font-medium">{formatDate(strategy.createdAt)}</div>
              </div>
            </div>

            {/* 투자 철학 */}
            {strategy.investmentPhilosophy && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="text-sm font-medium text-muted-foreground">투자 철학</div>
                <p className="mt-1 text-slate-700 whitespace-pre-wrap">
                  {strategy.investmentPhilosophy}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 포트폴리오 구성 테이블 (PORTFOLIO 타입일 때만) */}
        {strategy.stockSelectionType === 'PORTFOLIO' && defaultStocks.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>포트폴리오 구성</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>종목명</TableHead>
                      <TableHead>티커</TableHead>
                      <TableHead>시장</TableHead>
                      <TableHead className="text-right">비중(%)</TableHead>
                      <TableHead>메모</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defaultStocks.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">
                          {stock.stockName}
                          {stock.stockNameEn && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({stock.stockNameEn})
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{stock.ticker}</TableCell>
                        <TableCell>{stock.market}</TableCell>
                        <TableCell className="text-right">{stock.targetWeight}%</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {stock.memo || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-slate-50 font-semibold">
                      <TableCell colSpan={3}>합계</TableCell>
                      <TableCell
                        className={`text-right ${Math.abs(defaultStocksTotalWeight - 100) < 0.01 ? 'text-green-600' : 'text-orange-500'}`}
                      >
                        {defaultStocksTotalWeight.toFixed(2)}%
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 전략 조건 카드 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>전략 조건 (JSON)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-800">
              {JSON.stringify(JSON.parse(strategy.conditions || '{}'), null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* 백테스트 결과 */}
        <Card>
          <CardHeader>
            <CardTitle>백테스트 결과</CardTitle>
          </CardHeader>
          <CardContent>
            {strategy.backtestResults.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                백테스트 결과가 없습니다.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>기간</TableHead>
                      <TableHead className="text-right">CAGR</TableHead>
                      <TableHead className="text-right">MDD</TableHead>
                      <TableHead className="text-right">샤프 비율</TableHead>
                      <TableHead className="text-right">총 수익률</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategy.backtestResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{result.id}</TableCell>
                        <TableCell>
                          {result.startDate} ~ {result.endDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`flex items-center justify-end gap-1 ${result.cagr >= 0 ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {result.cagr >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {result.cagr >= 0 ? '+' : ''}
                            {result.cagr.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-red-500">
                          {result.mdd.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {result.sharpeRatio != null ? result.sharpeRatio.toFixed(2) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={result.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}
                          >
                            {result.totalReturn >= 0 ? '+' : ''}
                            {result.totalReturn.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={result.status === 'COMPLETED' ? 'default' : 'secondary'}>
                            {result.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
