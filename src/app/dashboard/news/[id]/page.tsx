'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Eye,
  EyeOff,
  Calendar,
  RefreshCw,
  AlertCircle,
  Loader2,
  ExternalLink,
  BarChart3,
  Tag,
} from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getNewsArticleById,
  hideNewsArticle,
  unhideNewsArticle,
  type AdminNewsArticle,
  sourceLabels,
  sourceColors,
} from '@/lib/api';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<AdminNewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadArticle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getNewsArticleById(articleId);
      setArticle(data);
    } catch (err) {
      console.error('기사 조회 실패:', err);
      setError(err instanceof Error ? err.message : '기사를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  const handleToggleHide = async () => {
    if (!article) return;
    const action = article.isHidden ? '복원' : '숨김';
    if (!confirm(`이 기사를 ${action}하시겠습니까?`)) return;

    setActionLoading(true);
    try {
      if (article.isHidden) {
        await unhideNewsArticle(article.id);
      } else {
        await hideNewsArticle(article.id);
      }
      await loadArticle();
      alert(`기사가 ${action} 처리되었습니다.`);
    } catch (err) {
      console.error(`${action} 실패:`, err);
      alert(`${action}에 실패했습니다.`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Header title="뉴스 상세" />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </>
    );
  }

  // 에러 상태
  if (error || !article) {
    return (
      <>
        <Header title="뉴스 상세" />
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-500">{error || '기사를 찾을 수 없습니다.'}</p>
          <div className="flex gap-2">
            <Button onClick={loadArticle} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <Button onClick={() => router.push('/dashboard/news')} variant="outline">
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
      <Header title="뉴스 상세" />

      <div className="p-6">
        {/* 상단 네비게이션 */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard/news"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            뉴스 목록으로 돌아가기
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/news/${articleId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                수정
              </Link>
            </Button>
            <Button
              variant={article.isHidden ? 'default' : 'destructive'}
              onClick={handleToggleHide}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : article.isHidden ? (
                <Eye className="mr-2 h-4 w-4" />
              ) : (
                <EyeOff className="mr-2 h-4 w-4" />
              )}
              {article.isHidden ? '복원' : '숨김'}
            </Button>
          </div>
        </div>

        {/* 기사 정보 카드 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl leading-snug">{article.titleKo}</CardTitle>
                {article.titleEn && (
                  <p className="mt-1 text-lg text-muted-foreground">{article.titleEn}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <Badge variant={article.isHidden ? 'destructive' : 'default'}>
                  {article.isHidden ? '숨김' : '활성'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 통계 그리드 */}
            <div className="grid gap-4 md:grid-cols-5">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="text-sm text-muted-foreground">출처</div>
                <div
                  className={`mt-1 text-lg font-bold ${sourceColors[article.source] || 'text-slate-400'}`}
                >
                  {sourceLabels[article.source] || article.source}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  중요도
                </div>
                <div
                  className={`mt-1 text-2xl font-bold ${
                    article.importanceScore >= 0.7
                      ? 'text-red-500'
                      : article.importanceScore >= 0.4
                        ? 'text-yellow-500'
                        : 'text-slate-400'
                  }`}
                >
                  {article.importanceScore.toFixed(2)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  조회수
                </div>
                <div className="mt-1 text-2xl font-bold text-emerald-500">{article.viewCount}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  작성일
                </div>
                <div className="mt-1 text-sm font-medium">
                  {formatDate(article.sourceCreatedAt)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  수집일
                </div>
                <div className="mt-1 text-sm font-medium">{formatDate(article.createdAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 본문 카드 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>본문</CardTitle>
          </CardHeader>
          <CardContent>
            {article.summaryKo && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-1 text-xs font-semibold uppercase text-emerald-700">요약</div>
                <p className="text-sm text-emerald-900 whitespace-pre-wrap">{article.summaryKo}</p>
              </div>
            )}
            {article.contentKo ? (
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap text-slate-700">{article.contentKo}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">본문이 없습니다 (헤드라인 기사).</p>
            )}
          </CardContent>
        </Card>

        {/* 메타 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>메타 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 태그 */}
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                태그
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.length > 0 ? (
                  article.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">태그 없음</span>
                )}
              </div>
            </div>

            {/* 티커 */}
            <div>
              <div className="mb-2 text-sm font-medium text-muted-foreground">티커</div>
              <div className="flex flex-wrap gap-2">
                {article.tickers.length > 0 ? (
                  article.tickers.map((ticker) => (
                    <Badge key={ticker} variant="secondary" className="font-mono">
                      {ticker}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">티커 없음</span>
                )}
              </div>
            </div>

            {/* 소스 URL */}
            {article.sourceUrl && (
              <div>
                <div className="mb-2 text-sm font-medium text-muted-foreground">소스 URL</div>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 hover:underline"
                >
                  {article.sourceUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* External ID */}
            <div>
              <div className="mb-2 text-sm font-medium text-muted-foreground">External ID</div>
              <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {article.externalId}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
