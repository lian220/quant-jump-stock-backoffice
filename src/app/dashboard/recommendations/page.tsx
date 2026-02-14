'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, BarChart3, Target, RefreshCw, Loader2, Search, Calendar } from 'lucide-react';
import { Header, StatCard } from '@/components/dashboard';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getLatestPredictions,
  getBuySignals,
  getPredictionStats,
  gradeBadgeStyles,
  priceRecommendationStyles,
} from '@/lib/api/predictions';
import type {
  PredictionItem,
  PredictionStatsResponse,
  CompositeGrade,
} from '@/lib/api/predictions';

export default function RecommendationsPage() {
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [buySignals, setBuySignals] = useState<PredictionItem[]>([]);
  const [stats, setStats] = useState<PredictionStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('predictions');

  // 필터
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statsDays, setStatsDays] = useState(7);
  const [signalDate, setSignalDate] = useState('');
  const [minConfidence, setMinConfidence] = useState(0.7);

  const loadPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLatestPredictions();
      if (response.success) {
        setPredictions(response.predictions);
      }
    } catch (err) {
      console.error('예측 데이터 로딩 실패:', err);
      setError('예측 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBuySignals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBuySignals(signalDate || undefined, minConfidence);
      if (response.success) {
        setBuySignals(response.buySignals);
      }
    } catch (err) {
      console.error('매수 신호 로딩 실패:', err);
      setError('매수 신호를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [signalDate, minConfidence]);

  const loadStats = useCallback(async () => {
    try {
      const response = await getPredictionStats(statsDays);
      if (response.success) {
        setStats(response);
      }
    } catch (err) {
      console.error('통계 로딩 실패:', err);
    }
  }, [statsDays]);

  useEffect(() => {
    loadPredictions();
    loadStats();
  }, [loadPredictions, loadStats]);

  useEffect(() => {
    if (activeTab === 'buy-signals') {
      loadBuySignals();
    }
  }, [activeTab, loadBuySignals]);

  const filteredPredictions = predictions.filter((p) => {
    const matchesGrade = gradeFilter === 'all' || p.compositeGrade === gradeFilter;
    const matchesSearch =
      !searchQuery ||
      p.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.stockName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const filteredBuySignals = buySignals.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.stockName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderPredictionTable = (items: PredictionItem[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>티커</TableHead>
            <TableHead>종목명</TableHead>
            <TableHead>분석일</TableHead>
            <TableHead>종합점수</TableHead>
            <TableHead>등급</TableHead>
            <TableHead>AI</TableHead>
            <TableHead>기술적</TableHead>
            <TableHead>감성</TableHead>
            <TableHead>현재가</TableHead>
            <TableHead>목표가</TableHead>
            <TableHead>상승여력</TableHead>
            <TableHead>추천</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                {loading ? '로딩 중...' : '데이터가 없습니다.'}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, idx) => (
              <TableRow key={`${item.ticker}-${item.analysisDate}-${idx}`}>
                <TableCell className="font-mono font-medium text-emerald-600">
                  {item.ticker}
                </TableCell>
                <TableCell className="font-medium">{item.stockName}</TableCell>
                <TableCell className="text-muted-foreground">{item.analysisDate}</TableCell>
                <TableCell>
                  <span className="font-bold">{item.compositeScore.toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  <Badge className={gradeBadgeStyles[item.compositeGrade]}>
                    {item.compositeGrade}
                  </Badge>
                </TableCell>
                <TableCell>{item.aiScore.toFixed(2)}</TableCell>
                <TableCell>{item.techScore.toFixed(2)}</TableCell>
                <TableCell>{item.sentimentScore.toFixed(2)}</TableCell>
                <TableCell>
                  {item.currentPrice ? `$${item.currentPrice.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell>
                  {item.targetPrice ? `$${item.targetPrice.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell>
                  {item.upsidePercent != null ? (
                    <span
                      className={
                        item.upsidePercent > 0
                          ? 'font-medium text-emerald-600'
                          : 'font-medium text-red-600'
                      }
                    >
                      {item.upsidePercent > 0 ? '+' : ''}
                      {item.upsidePercent.toFixed(1)}%
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {item.priceRecommendation ? (
                    <Badge
                      className={
                        priceRecommendationStyles[item.priceRecommendation] ||
                        'bg-slate-100 text-slate-700'
                      }
                    >
                      {item.priceRecommendation}
                    </Badge>
                  ) : item.isRecommended ? (
                    <Badge className="bg-emerald-100 text-emerald-700">추천</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (loading && predictions.length === 0 && buySignals.length === 0) {
    return (
      <>
        <Header title="종목 추천" />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </>
    );
  }

  if (error && predictions.length === 0 && buySignals.length === 0) {
    return (
      <>
        <Header title="종목 추천" />
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={loadPredictions} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="종목 추천" />

      <div className="p-6">
        {/* 통계 카드 */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard
            title="전체 예측"
            value={stats?.stats.total?.toString() || predictions.length.toString()}
            icon={BarChart3}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatCard
            title="추천 종목"
            value={
              stats?.stats.recommended?.toString() ||
              predictions.filter((p) => p.isRecommended).length.toString()
            }
            icon={Target}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-100"
          />
          <StatCard
            title="평균 종합점수"
            value={stats?.stats.averageCompositeScore || '-'}
            icon={TrendingUp}
            iconColor="text-violet-600"
            iconBgColor="bg-violet-100"
          />
          <StatCard
            title="분석 종목수"
            value={stats?.stats.uniqueTickers?.toString() || '-'}
            icon={BarChart3}
            iconColor="text-amber-600"
            iconBgColor="bg-amber-100"
          />
        </div>

        {/* 등급 분포 */}
        {stats?.stats.gradeDistribution && (
          <div className="mb-6 grid gap-3 md:grid-cols-5">
            {(['S', 'A', 'B', 'C', 'D'] as CompositeGrade[]).map((grade) => (
              <Card key={grade}>
                <CardContent className="flex items-center justify-between p-4">
                  <Badge className={gradeBadgeStyles[grade]}>{grade}등급</Badge>
                  <span className="text-2xl font-bold">
                    {stats.stats.gradeDistribution[grade] || 0}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="predictions">최신 예측</TabsTrigger>
            <TabsTrigger value="buy-signals">매수 신호</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>최신 예측 결과</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={statsDays.toString()}
                    onValueChange={(v) => setStatsDays(Number(v))}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3일</SelectItem>
                      <SelectItem value="7">7일</SelectItem>
                      <SelectItem value="14">14일</SelectItem>
                      <SelectItem value="30">30일</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={loadPredictions} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    새로고침
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* 필터 */}
                <div className="mb-4 flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="티커 또는 종목명으로 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="등급" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 등급</SelectItem>
                      <SelectItem value="S">S등급</SelectItem>
                      <SelectItem value="A">A등급</SelectItem>
                      <SelectItem value="B">B등급</SelectItem>
                      <SelectItem value="C">C등급</SelectItem>
                      <SelectItem value="D">D등급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {renderPredictionTable(filteredPredictions)}

                <div className="mt-4 text-sm text-muted-foreground">
                  총 {filteredPredictions.length}개 결과
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buy-signals">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>매수 신호</CardTitle>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={signalDate}
                      onChange={(e) => setSignalDate(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  <Select
                    value={minConfidence.toString()}
                    onValueChange={(v) => setMinConfidence(Number(v))}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">신뢰도 50%+</SelectItem>
                      <SelectItem value="0.6">신뢰도 60%+</SelectItem>
                      <SelectItem value="0.7">신뢰도 70%+</SelectItem>
                      <SelectItem value="0.8">신뢰도 80%+</SelectItem>
                      <SelectItem value="0.9">신뢰도 90%+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={loadBuySignals} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    조회
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="티커 또는 종목명으로 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {renderPredictionTable(filteredBuySignals)}

                <div className="mt-4 text-sm text-muted-foreground">
                  총 {filteredBuySignals.length}개 매수 신호
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
