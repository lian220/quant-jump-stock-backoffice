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
import {
  getNewsArticleById,
  updateNewsArticle,
  type AdminNewsArticle,
  type UpdateNewsArticleRequest,
} from '@/lib/api';

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<AdminNewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [titleKo, setTitleKo] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [summaryKo, setSummaryKo] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tickersInput, setTickersInput] = useState('');
  const [importanceScore, setImportanceScore] = useState(0.5);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadArticle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getNewsArticleById(articleId);
      setArticle(data);
      setTitleKo(data.titleKo);
      setTitleEn(data.titleEn || '');
      setSummaryKo(data.summaryKo || '');
      setTagsInput(data.tags.join(', '));
      setTickersInput(data.tickers.join(', '));
      setImportanceScore(data.importanceScore);
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!titleKo.trim()) newErrors.titleKo = '한글 제목을 입력해주세요.';
    if (importanceScore < 0 || importanceScore > 1)
      newErrors.importanceScore = '0~1 사이의 값을 입력해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const request: UpdateNewsArticleRequest = {
        titleKo: titleKo.trim(),
        titleEn: titleEn.trim() || undefined,
        summaryKo: summaryKo.trim() || undefined,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        tickers: tickersInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        importanceScore,
      };

      await updateNewsArticle(articleId, request);
      alert('기사가 수정되었습니다.');
      router.push(`/dashboard/news/${articleId}`);
    } catch (err) {
      console.error('수정 실패:', err);
      alert('수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Header title="뉴스 수정" />
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
        <Header title="뉴스 수정" />
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
      <Header title="뉴스 수정" />

      <div className="p-6">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Link
            href={`/dashboard/news/${articleId}`}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            기사 상세로 돌아가기
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>기사 정보 수정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 한글 제목 */}
            <div className="space-y-2">
              <Label htmlFor="titleKo">제목 (한글) *</Label>
              <Input
                id="titleKo"
                value={titleKo}
                onChange={(e) => setTitleKo(e.target.value)}
                placeholder="한글 제목을 입력하세요"
              />
              {errors.titleKo && <p className="text-sm text-red-500">{errors.titleKo}</p>}
            </div>

            {/* 영문 제목 */}
            <div className="space-y-2">
              <Label htmlFor="titleEn">제목 (영문)</Label>
              <Input
                id="titleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="영문 제목을 입력하세요"
              />
            </div>

            {/* 요약 */}
            <div className="space-y-2">
              <Label htmlFor="summaryKo">요약</Label>
              <Textarea
                id="summaryKo"
                value={summaryKo}
                onChange={(e) => setSummaryKo(e.target.value)}
                placeholder="기사 요약을 입력하세요"
                rows={3}
              />
            </div>

            {/* 태그 */}
            <div className="space-y-2">
              <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="예: 반도체, AI, 실적발표"
              />
              <p className="text-xs text-muted-foreground">쉼표(,)로 구분하여 입력하세요.</p>
            </div>

            {/* 티커 */}
            <div className="space-y-2">
              <Label htmlFor="tickers">티커 (쉼표로 구분)</Label>
              <Input
                id="tickers"
                value={tickersInput}
                onChange={(e) => setTickersInput(e.target.value)}
                placeholder="예: AAPL, MSFT, 005930"
              />
              <p className="text-xs text-muted-foreground">쉼표(,)로 구분하여 입력하세요.</p>
            </div>

            {/* 중요도 */}
            <div className="space-y-2">
              <Label htmlFor="importance">중요도 (0.0 ~ 1.0)</Label>
              <Input
                id="importance"
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={importanceScore}
                onChange={(e) => setImportanceScore(Number(e.target.value))}
              />
              {errors.importanceScore && (
                <p className="text-sm text-red-500">{errors.importanceScore}</p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => router.push(`/dashboard/news/${articleId}`)}>
                취소
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                저장
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
