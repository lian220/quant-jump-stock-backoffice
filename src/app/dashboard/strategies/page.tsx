'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  MoreHorizontal,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Send,
  TrendingUp,
  Clock,
  FileText,
  AlertCircle,
  RefreshCw,
  Loader2,
  Plus,
} from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getStrategies,
  getStrategyStats,
  approveStrategy,
  rejectStrategy,
  publishStrategy,
  type StrategySummary,
  type StrategyStatus,
  type StrategyStatsResponse,
  statusLabels,
  statusVariants,
  stockSelectionTypeLabels,
  type StockSelectionType,
} from '@/lib/api';

// 상태별 아이콘 설정
const statusIcons: Record<StrategyStatus, React.ElementType> = {
  DRAFT: FileText,
  PENDING_REVIEW: Clock,
  APPROVED: CheckCircle,
  PUBLISHED: Send,
  REJECTED: XCircle,
  ACTIVE: CheckCircle,
  ARCHIVED: FileText,
};

// 카테고리 코드 → 한글 레이블
const categoryLabels: Record<string, string> = {
  VALUE: '가치',
  MOMENTUM: '모멘텀',
  ASSET_ALLOCATION: '자산배분',
  QUANT_COMPOSITE: '복합',
  SEASONAL: '시즌',
  CUSTOM: '커스텀',
  ML_PREDICTION: 'AI/ML',
};

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

export default function StrategiesPage() {
  // 상태 관리
  const [strategies, setStrategies] = useState<StrategySummary[]>([]);
  const [stats, setStats] = useState<StrategyStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // 페이지네이션 상태
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  // 모달 상태
  const [selectedStrategy, setSelectedStrategy] = useState<StrategySummary | null>(null);

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [strategiesRes, statsRes] = await Promise.all([
        getStrategies({
          page,
          size: pageSize,
          status: statusFilter !== 'all' ? (statusFilter as StrategyStatus) : undefined,
          categoryCode: categoryFilter !== 'all' ? categoryFilter : undefined,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        }),
        getStrategyStats(),
      ]);

      setStrategies(strategiesRes.strategies);
      setTotal(strategiesRes.total);
      setTotalPages(strategiesRes.totalPages);
      setStats(statsRes);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, categoryFilter]);

  // 초기 로드 및 필터 변경 시 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 검색 필터링 (클라이언트 사이드)
  const filteredStrategies = strategies.filter((strategy) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      strategy.name.toLowerCase().includes(query) ||
      strategy.ownerName?.toLowerCase().includes(query) ||
      strategy.description?.toLowerCase().includes(query)
    );
  });

  // 승인 처리
  const handleApprove = async (strategy: StrategySummary) => {
    if (!confirm(`"${strategy.name}" 전략을 승인하시겠습니까?`)) return;

    setActionLoading(strategy.id);
    try {
      await approveStrategy(strategy.id);
      await loadData();
      alert(`"${strategy.name}" 전략이 승인되었습니다.`);
    } catch (err) {
      console.error('승인 실패:', err);
      alert('승인에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  // 반려 처리
  const handleReject = async (strategy: StrategySummary) => {
    const reason = prompt('반려 사유를 입력해주세요:');
    if (reason === null) return;

    setActionLoading(strategy.id);
    try {
      await rejectStrategy(strategy.id, reason || undefined);
      await loadData();
      alert(`"${strategy.name}" 전략이 반려되었습니다.`);
    } catch (err) {
      console.error('반려 실패:', err);
      alert('반려에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  // 발행 처리
  const handlePublish = async (strategy: StrategySummary) => {
    if (!confirm(`"${strategy.name}" 전략을 발행하시겠습니까?`)) return;

    setActionLoading(strategy.id);
    try {
      await publishStrategy(strategy.id);
      await loadData();
      alert(`"${strategy.name}" 전략이 발행되었습니다.`);
    } catch (err) {
      console.error('발행 실패:', err);
      alert('발행에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 로딩 상태
  if (loading && strategies.length === 0) {
    return (
      <>
        <Header title="전략 관리" />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </>
    );
  }

  // 에러 상태
  if (error && strategies.length === 0) {
    return (
      <>
        <Header title="전략 관리" />
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="전략 관리" />

      <div className="p-6">
        {/* 통계 카드 */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">전체 전략</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">검토 대기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats?.pendingReview ?? 0}
                </div>
                {(stats?.pendingReview ?? 0) > 0 && (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">발행 중</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.published ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 구독자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-emerald-600">
                  {stats?.totalSubscribers ?? 0}
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 전략 목록 카드 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>전략 목록</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard/strategies/new">
                  <Plus className="mr-2 h-4 w-4" />
                  전략 등록
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 검색 및 필터 */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="전략명, 작성자, 설명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v);
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="w-36">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="DRAFT">초안</SelectItem>
                    <SelectItem value="PENDING_REVIEW">검토 대기</SelectItem>
                    <SelectItem value="APPROVED">승인됨</SelectItem>
                    <SelectItem value="PUBLISHED">발행됨</SelectItem>
                    <SelectItem value="REJECTED">반려됨</SelectItem>
                    <SelectItem value="ARCHIVED">보관됨</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={(v) => {
                    setCategoryFilter(v);
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 유형</SelectItem>
                    <SelectItem value="MOMENTUM">모멘텀</SelectItem>
                    <SelectItem value="VALUE">가치</SelectItem>
                    <SelectItem value="ASSET_ALLOCATION">자산배분</SelectItem>
                    <SelectItem value="QUANT_COMPOSITE">복합</SelectItem>
                    <SelectItem value="SEASONAL">시즌</SelectItem>
                    <SelectItem value="ML_PREDICTION">AI/ML</SelectItem>
                    <SelectItem value="CUSTOM">커스텀</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 테이블 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>전략명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>종목선정</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead className="text-right">CAGR</TableHead>
                    <TableHead className="text-right">MDD</TableHead>
                    <TableHead className="text-right">구독자</TableHead>
                    <TableHead>수정일</TableHead>
                    <TableHead className="w-32">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStrategies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                        {loading ? '로딩 중...' : '전략이 없습니다.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStrategies.map((strategy) => {
                      const StatusIcon = statusIcons[strategy.status];
                      const isActionLoading = actionLoading === strategy.id;
                      return (
                        <TableRow key={strategy.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{strategy.name}</div>
                              <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                                {strategy.description || '-'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-medium ${categoryColors[strategy.categoryCode] || 'text-slate-400'}`}
                            >
                              {categoryLabels[strategy.categoryCode] || strategy.categoryName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                strategy.stockSelectionType === 'PORTFOLIO'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {stockSelectionTypeLabels[
                                strategy.stockSelectionType as StockSelectionType
                              ] || strategy.stockSelectionType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariants[strategy.status]} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {statusLabels[strategy.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{strategy.ownerName || '-'}</div>
                              <div className="text-xs text-muted-foreground">
                                {strategy.ownerEmail || '-'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {strategy.latestCagr != null ? (
                              <span
                                className={
                                  strategy.latestCagr >= 0 ? 'text-green-500' : 'text-red-500'
                                }
                              >
                                {strategy.latestCagr >= 0 ? '+' : ''}
                                {strategy.latestCagr.toFixed(1)}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {strategy.latestMdd != null ? (
                              <span className="text-red-500">{strategy.latestMdd.toFixed(1)}%</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{strategy.subscriberCount}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(strategy.updatedAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {/* 상세 보기 */}
                              <Button variant="ghost" size="icon" title="상세 보기" asChild>
                                <Link href={`/dashboard/strategies/${strategy.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>

                              {/* 검토 대기 상태: 승인/반려 버튼 */}
                              {strategy.status === 'PENDING_REVIEW' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="승인"
                                    className="text-green-500 hover:text-green-600"
                                    onClick={() => handleApprove(strategy)}
                                    disabled={isActionLoading}
                                  >
                                    {isActionLoading ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="반려"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => handleReject(strategy)}
                                    disabled={isActionLoading}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}

                              {/* 승인됨 상태: 발행 버튼 */}
                              {strategy.status === 'APPROVED' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="발행"
                                  className="text-blue-500 hover:text-blue-600"
                                  onClick={() => handlePublish(strategy)}
                                  disabled={isActionLoading}
                                >
                                  {isActionLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Send className="h-4 w-4" />
                                  )}
                                </Button>
                              )}

                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 페이지네이션 */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                총 {total}개의 전략 (페이지 {page + 1} / {Math.max(totalPages, 1)})
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                >
                  이전
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1 || loading}
                >
                  다음
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 보기 모달 */}
      {selectedStrategy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-2xl rounded-xl bg-white border border-slate-200 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedStrategy.name}</h2>
                <p className="text-sm text-slate-500">
                  {categoryLabels[selectedStrategy.categoryCode] || selectedStrategy.categoryName}{' '}
                  전략 • {selectedStrategy.ownerName || '알 수 없음'}
                </p>
              </div>
              <Badge variant={statusVariants[selectedStrategy.status]}>
                {statusLabels[selectedStrategy.status]}
              </Badge>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-slate-500">설명</h3>
                <p className="text-slate-900">{selectedStrategy.description || '-'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">CAGR</h3>
                  <p
                    className={`text-lg font-bold ${(selectedStrategy.latestCagr ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {selectedStrategy.latestCagr != null ? (
                      <>
                        {selectedStrategy.latestCagr >= 0 ? '+' : ''}
                        {selectedStrategy.latestCagr.toFixed(2)}%
                      </>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">MDD</h3>
                  <p className="text-lg font-bold text-red-500">
                    {selectedStrategy.latestMdd != null
                      ? `${selectedStrategy.latestMdd.toFixed(2)}%`
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">구독자 수</h3>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedStrategy.subscriberCount}명
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">작성자 이메일</h3>
                  <p className="text-slate-900">{selectedStrategy.ownerEmail || '-'}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">평균 평점</h3>
                  <p className="text-lg font-bold text-yellow-500">
                    {selectedStrategy.averageRating > 0
                      ? selectedStrategy.averageRating.toFixed(1)
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">종목선정 방식</h3>
                  <p className="text-slate-900">
                    {stockSelectionTypeLabels[
                      selectedStrategy.stockSelectionType as StockSelectionType
                    ] || selectedStrategy.stockSelectionType}
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">리밸런싱 주기</h3>
                  <p className="text-slate-900">{selectedStrategy.rebalanceFrequency}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">생성일</h3>
                  <p className="text-slate-900">{formatDate(selectedStrategy.createdAt)}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">수정일</h3>
                  <p className="text-slate-900">{formatDate(selectedStrategy.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {selectedStrategy.status === 'PENDING_REVIEW' && (
                <>
                  <Button
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => {
                      handleReject(selectedStrategy);
                      setSelectedStrategy(null);
                    }}
                    disabled={actionLoading === selectedStrategy.id}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    반려
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(selectedStrategy);
                      setSelectedStrategy(null);
                    }}
                    disabled={actionLoading === selectedStrategy.id}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    승인
                  </Button>
                </>
              )}
              {selectedStrategy.status === 'APPROVED' && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    handlePublish(selectedStrategy);
                    setSelectedStrategy(null);
                  }}
                  disabled={actionLoading === selectedStrategy.id}
                >
                  <Send className="mr-2 h-4 w-4" />
                  발행하기
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedStrategy(null)}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
