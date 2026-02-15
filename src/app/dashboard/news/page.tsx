'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  Plus,
  AlertCircle,
  Newspaper,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  getNewsArticles,
  getNewsArticleStats,
  hideNewsArticle,
  unhideNewsArticle,
  type AdminNewsArticle,
  type NewsArticleStatsResponse,
  type NewsSource,
  sourceLabels,
  sourceColors,
} from '@/lib/api';

export default function NewsListPage() {
  const [articles, setArticles] = useState<AdminNewsArticle[]>([]);
  const [stats, setStats] = useState<NewsArticleStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [includeHidden, setIncludeHidden] = useState(true);

  // 페이지네이션 상태
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [articlesRes, statsRes] = await Promise.all([
        getNewsArticles({
          page,
          size: pageSize,
          source: sourceFilter !== 'all' ? (sourceFilter as NewsSource) : undefined,
          includeHidden,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        }),
        getNewsArticleStats(),
      ]);

      setArticles(articlesRes.articles);
      setTotal(articlesRes.total);
      setTotalPages(articlesRes.totalPages);
      setStats(statsRes);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, sourceFilter, includeHidden]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 검색 필터링 (클라이언트 사이드)
  const filteredArticles = articles.filter((article) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.titleKo.toLowerCase().includes(query) ||
      article.titleEn?.toLowerCase().includes(query) ||
      article.tags.some((t) => t.toLowerCase().includes(query)) ||
      article.tickers.some((t) => t.toLowerCase().includes(query))
    );
  });

  // 숨김/복원 처리
  const handleToggleHide = async (article: AdminNewsArticle) => {
    const action = article.isHidden ? '복원' : '숨김';
    if (!confirm(`"${article.titleKo}" 기사를 ${action}하시겠습니까?`)) return;

    setActionLoading(article.id);
    try {
      if (article.isHidden) {
        await unhideNewsArticle(article.id);
      } else {
        await hideNewsArticle(article.id);
      }
      await loadData();
      alert(`기사가 ${action} 처리되었습니다.`);
    } catch (err) {
      console.error(`${action} 실패:`, err);
      alert(`${action}에 실패했습니다.`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 로딩 상태
  if (loading && articles.length === 0) {
    return (
      <>
        <Header title="뉴스 관리" />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </>
    );
  }

  // 에러 상태
  if (error && articles.length === 0) {
    return (
      <>
        <Header title="뉴스 관리" />
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
      <Header title="뉴스 관리" />

      <div className="p-6">
        {/* 통계 카드 */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">전체 뉴스</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
                <Newspaper className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">활성 뉴스</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600">{stats?.active ?? 0}</div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">숨김 뉴스</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-yellow-600">{stats?.hidden ?? 0}</div>
                {(stats?.hidden ?? 0) > 0 && <AlertCircle className="h-5 w-5 text-yellow-500" />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                평균 중요도
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-emerald-600">
                  {(stats?.avgImportance ?? 0).toFixed(2)}
                </div>
                <BarChart3 className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 뉴스 목록 카드 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>뉴스 목록</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard/news/new">
                  <Plus className="mr-2 h-4 w-4" />
                  뉴스 등록
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 검색 및 필터 */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="현재 페이지에서 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={sourceFilter}
                  onValueChange={(v) => {
                    setSourceFilter(v);
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="출처" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 출처</SelectItem>
                    {Object.entries(sourceLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includeHidden}
                    onCheckedChange={(checked) => {
                      setIncludeHidden(checked === true);
                      setPage(0);
                    }}
                  />
                  <span className="text-sm text-muted-foreground">숨김 포함</span>
                </label>
              </div>
            </div>

            {/* 테이블 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[300px]">제목</TableHead>
                    <TableHead>출처</TableHead>
                    <TableHead>태그</TableHead>
                    <TableHead>티커</TableHead>
                    <TableHead className="text-right">중요도</TableHead>
                    <TableHead className="text-right">조회수</TableHead>
                    <TableHead>작성일</TableHead>
                    <TableHead className="w-24">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        {loading ? '로딩 중...' : '뉴스가 없습니다.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredArticles.map((article) => {
                      const isActionLoading = actionLoading === article.id;
                      return (
                        <TableRow key={article.id} className={article.isHidden ? 'opacity-50' : ''}>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium line-clamp-1">{article.titleKo}</span>
                                {article.isHidden && (
                                  <Badge variant="secondary" className="text-xs shrink-0">
                                    숨김
                                  </Badge>
                                )}
                              </div>
                              {article.titleEn && (
                                <div className="max-w-[280px] truncate text-sm text-muted-foreground">
                                  {article.titleEn}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-sm font-medium ${sourceColors[article.source] || 'text-slate-400'}`}
                            >
                              {sourceLabels[article.source] || article.source}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {article.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{article.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {article.tickers.slice(0, 2).map((ticker) => (
                                <Badge
                                  key={ticker}
                                  variant="secondary"
                                  className="text-xs font-mono"
                                >
                                  {ticker}
                                </Badge>
                              ))}
                              {article.tickers.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{article.tickers.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                article.importanceScore >= 0.7
                                  ? 'text-red-500 font-medium'
                                  : article.importanceScore >= 0.4
                                    ? 'text-yellow-500'
                                    : 'text-slate-400'
                              }
                            >
                              {article.importanceScore.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{article.viewCount}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(article.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" title="상세 보기" asChild>
                                <Link href={`/dashboard/news/${article.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title={article.isHidden ? '복원' : '숨김'}
                                className={
                                  article.isHidden
                                    ? 'text-green-500 hover:text-green-600'
                                    : 'text-yellow-500 hover:text-yellow-600'
                                }
                                onClick={() => handleToggleHide(article)}
                                disabled={isActionLoading}
                              >
                                {isActionLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : article.isHidden ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
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
                총 {total}개의 뉴스 (페이지 {page + 1} / {Math.max(totalPages, 1)})
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
    </>
  );
}
