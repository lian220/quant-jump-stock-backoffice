'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createNewsArticle, type CreateNewsArticleRequest } from '@/lib/api';

export default function NewNewsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // 폼 상태
  const [titleKo, setTitleKo] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [contentKo, setContentKo] = useState('');
  const [summaryKo, setSummaryKo] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tickersInput, setTickersInput] = useState('');
  const [importanceScore, setImportanceScore] = useState(0.5);
  const [sourceUrl, setSourceUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!titleKo.trim()) newErrors.titleKo = '한글 제목을 입력해주세요.';
    if (Number.isNaN(importanceScore) || importanceScore < 0 || importanceScore > 1)
      newErrors.importanceScore = '0~1 사이의 값을 입력해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const request: CreateNewsArticleRequest = {
        titleKo: titleKo.trim(),
        titleEn: titleEn.trim() || undefined,
        contentKo: contentKo.trim() || undefined,
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
        sourceUrl: sourceUrl.trim() || undefined,
      };

      const created = await createNewsArticle(request);
      alert('뉴스가 등록되었습니다.');
      router.push(`/dashboard/news/${created.id}`);
    } catch (err) {
      console.error('등록 실패:', err);
      alert('등록에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title="뉴스 등록" />

      <div className="p-6">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Link
            href="/dashboard/news"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            뉴스 목록으로 돌아가기
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>새 뉴스 등록</CardTitle>
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

            {/* 내용 */}
            <div className="space-y-2">
              <Label htmlFor="contentKo">내용</Label>
              <Textarea
                id="contentKo"
                value={contentKo}
                onChange={(e) => setContentKo(e.target.value)}
                placeholder="뉴스 내용을 입력하세요"
                rows={8}
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

            {/* 출처 URL */}
            <div className="space-y-2">
              <Label htmlFor="sourceUrl">출처 URL</Label>
              <Input
                id="sourceUrl"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/news')}>
                취소
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                등록
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
