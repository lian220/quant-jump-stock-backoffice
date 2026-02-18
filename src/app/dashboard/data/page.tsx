'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Database,
  Play,
  Pause,
  RefreshCw,
  Loader2,
  Clock,
  Activity,
  Zap,
  Brain,
  BarChart3,
  Calendar,
  Power,
  PowerOff,
  CheckCircle2,
  XCircle,
  Sparkles,
  Target,
} from 'lucide-react';
import { Header, StatCard } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  collectEconomicData,
  getEconomicDataStatus,
  runTechnicalAnalysis,
  runSentimentAnalysis,
  runParallelAnalysis,
  getAnalysisStatus,
  triggerVertexAIPrediction,
  triggerStockRecommendation,
  runAdminBacktestAll,
  runAdminBacktestByStrategy,
} from '@/lib/api/data';
import type { DataStatusResponse, AnalysisStatusResponse } from '@/lib/api/data';
import {
  getSchedulerStatus,
  getSchedules,
  pauseSchedule,
  resumeSchedule,
  startScheduler,
  stopScheduler,
  triggerStateLabels,
  triggerStateBadgeStyles,
  scheduleDescriptions,
  implementedSchedules,
} from '@/lib/api/scheduler';
import type { SchedulerStatus, ScheduleInfo, TriggerState } from '@/lib/api/scheduler';

// 작업 로그 항목
interface ActionLog {
  id: string;
  timestamp: string;
  action: string;
  result: 'success' | 'error';
  message: string;
}

export default function DataPage() {
  // 스케줄러
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatus | null>(null);
  const [schedules, setSchedules] = useState<Record<string, ScheduleInfo>>({});
  const [schedulerLoading, setSchedulerLoading] = useState(true);
  const [schedulerActionLoading, setSchedulerActionLoading] = useState<string | null>(null);

  // 데이터 상태
  const [economicStatus, setEconomicStatus] = useState<DataStatusResponse | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatusResponse | null>(null);

  // 수동 실행 폼
  const [collectStartDate, setCollectStartDate] = useState('');
  const [collectEndDate, setCollectEndDate] = useState('');
  const [analysisStartDate, setAnalysisStartDate] = useState('');
  const [analysisEndDate, setAnalysisEndDate] = useState('');
  const [recoStartDate, setRecoStartDate] = useState('');
  const [recoEndDate, setRecoEndDate] = useState('');
  const [backtestStrategyId, setBacktestStrategyId] = useState('');
  const [backtestPeriodDays, setBacktestPeriodDays] = useState('365');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 작업 로그
  const [logs, setLogs] = useState<ActionLog[]>([]);

  const addLog = (action: string, result: 'success' | 'error', message: string) => {
    setLogs((prev) => [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString('ko-KR'),
        action,
        result,
        message,
      },
      ...prev.slice(0, 19), // 최대 20개
    ]);
  };

  // === 스케줄러 로드 ===
  const loadScheduler = useCallback(async () => {
    try {
      setSchedulerLoading(true);
      const [status, schedulesData] = await Promise.all([getSchedulerStatus(), getSchedules()]);
      setSchedulerStatus(status);
      setSchedules(schedulesData);
    } catch (err) {
      console.error('스케줄러 정보 로딩 실패:', err);
    } finally {
      setSchedulerLoading(false);
    }
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      const [ecoStatus, anaStatus] = await Promise.all([
        getEconomicDataStatus(),
        getAnalysisStatus(),
      ]);
      setEconomicStatus(ecoStatus);
      setAnalysisStatus(anaStatus);
    } catch (err) {
      console.error('상태 로딩 실패:', err);
    }
  }, []);

  useEffect(() => {
    loadScheduler();
    loadStatus();
  }, [loadScheduler, loadStatus]);

  // === 스케줄러 액션 ===
  const handleStartScheduler = async () => {
    try {
      setSchedulerActionLoading('start');
      const res = await startScheduler();
      addLog('스케줄러 시작', res.success ? 'success' : 'error', res.message);
      await loadScheduler();
    } catch {
      addLog('스케줄러 시작', 'error', '스케줄러 시작에 실패했습니다.');
    } finally {
      setSchedulerActionLoading(null);
    }
  };

  const handleStopScheduler = async () => {
    if (!confirm('스케줄러를 중지하시겠습니까? 모든 예약 작업이 중단됩니다.')) return;
    try {
      setSchedulerActionLoading('stop');
      const res = await stopScheduler();
      addLog('스케줄러 중지', res.success ? 'success' : 'error', res.message);
      await loadScheduler();
    } catch {
      addLog('스케줄러 중지', 'error', '스케줄러 중지에 실패했습니다.');
    } finally {
      setSchedulerActionLoading(null);
    }
  };

  const handlePauseSchedule = async (triggerName: string) => {
    try {
      setSchedulerActionLoading(triggerName);
      const res = await pauseSchedule(triggerName);
      addLog(`${triggerName} 일시중지`, res.success ? 'success' : 'error', res.message);
      await loadScheduler();
    } catch {
      addLog(`${triggerName} 일시중지`, 'error', '스케줄 일시중지에 실패했습니다.');
    } finally {
      setSchedulerActionLoading(null);
    }
  };

  const handleResumeSchedule = async (triggerName: string) => {
    try {
      setSchedulerActionLoading(triggerName);
      const res = await resumeSchedule(triggerName);
      addLog(`${triggerName} 재개`, res.success ? 'success' : 'error', res.message);
      await loadScheduler();
    } catch {
      addLog(`${triggerName} 재개`, 'error', '스케줄 재개에 실패했습니다.');
    } finally {
      setSchedulerActionLoading(null);
    }
  };

  // === 수동 실행 액션 ===
  const handleCollectEconomicData = async () => {
    try {
      setActionLoading('collect');
      const res = await collectEconomicData(
        collectStartDate || undefined,
        collectEndDate || undefined,
      );
      addLog('경제 데이터 수집', res.success ? 'success' : 'error', res.message);
    } catch {
      addLog('경제 데이터 수집', 'error', '경제 데이터 수집 요청에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunTechnical = async () => {
    try {
      setActionLoading('technical');
      const res = await runTechnicalAnalysis(
        analysisStartDate || undefined,
        analysisEndDate || undefined,
      );
      addLog('기술적 분석', res.success ? 'success' : 'error', res.message);
    } catch {
      addLog('기술적 분석', 'error', '기술적 분석 요청에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunSentiment = async () => {
    try {
      setActionLoading('sentiment');
      const res = await runSentimentAnalysis(
        analysisStartDate || undefined,
        analysisEndDate || undefined,
      );
      addLog('감성 분석', res.success ? 'success' : 'error', res.message);
    } catch {
      addLog('감성 분석', 'error', '감성 분석 요청에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunParallel = async () => {
    try {
      setActionLoading('parallel');
      const res = await runParallelAnalysis();
      addLog('병렬 분석', res.success ? 'success' : 'error', res.message);
    } catch {
      addLog('병렬 분석', 'error', '병렬 분석 요청에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleTriggerVertexAI = async () => {
    try {
      setActionLoading('vertexai');
      const res = await triggerVertexAIPrediction();
      addLog(
        'Vertex AI 예측',
        res.success ? 'success' : 'error',
        res.message + (res.estimatedTime ? ` (예상: ${res.estimatedTime})` : ''),
      );
    } catch {
      addLog('Vertex AI 예측', 'error', 'Vertex AI 예측 요청에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleTriggerRecommendation = async () => {
    try {
      setActionLoading('recommendation');
      const res = await triggerStockRecommendation(
        recoStartDate || undefined,
        recoEndDate || undefined,
      );
      addLog('종목 추천', res.success ? 'success' : 'error', res.message);
    } catch {
      addLog('종목 추천', 'error', '종목 추천 요청에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunBacktestAll = async () => {
    try {
      setActionLoading('backtest-all');
      const res = await runAdminBacktestAll(
        backtestPeriodDays ? parseInt(backtestPeriodDays) : undefined,
      );
      addLog(
        '전체 전략 백테스트',
        res.totalRequested ? 'success' : 'error',
        res.message || `${res.totalRequested}개 전략 백테스트 요청`,
      );
    } catch {
      addLog('전체 전략 백테스트', 'error', '전체 백테스트 실행에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunBacktestSingle = async () => {
    if (!backtestStrategyId) {
      addLog('전략 백테스트', 'error', '전략 ID를 입력해주세요.');
      return;
    }
    try {
      setActionLoading('backtest-single');
      const res = await runAdminBacktestByStrategy(
        parseInt(backtestStrategyId),
        backtestPeriodDays ? parseInt(backtestPeriodDays) : undefined,
      );
      addLog(
        `전략 #${backtestStrategyId} 백테스트`,
        res.requestId ? 'success' : 'error',
        res.message || `전략 ${res.strategyName} 백테스트 요청 완료`,
      );
    } catch {
      addLog(`전략 #${backtestStrategyId} 백테스트`, 'error', '백테스트 실행에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString('ko-KR');
    } catch {
      return dateStr;
    }
  };

  const scheduleEntries = Object.entries(schedules);

  return (
    <>
      <Header title="데이터 관리" />

      <div className="p-6">
        {/* 상단 통계 */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard
            title="스케줄러 상태"
            value={schedulerStatus?.isRunning ? '실행 중' : '중지됨'}
            icon={schedulerStatus?.isRunning ? Activity : PowerOff}
            iconColor={schedulerStatus?.isRunning ? 'text-emerald-600' : 'text-red-600'}
            iconBgColor={schedulerStatus?.isRunning ? 'bg-emerald-100' : 'bg-red-100'}
          />
          <StatCard
            title="예약 작업"
            value={schedulerStatus?.scheduledJobCount?.toString() || '0'}
            icon={Clock}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatCard
            title="활성 트리거"
            value={schedulerStatus?.activeTriggerCount?.toString() || '0'}
            icon={Zap}
            iconColor="text-violet-600"
            iconBgColor="bg-violet-100"
          />
          <StatCard
            title="경제데이터 서비스"
            value={economicStatus?.status === 'running' ? '정상' : economicStatus?.status || '-'}
            icon={Database}
            iconColor="text-amber-600"
            iconBgColor="bg-amber-100"
          />
        </div>

        {/* 탭 */}
        <Tabs defaultValue="scheduler">
          <TabsList>
            <TabsTrigger value="scheduler">스케줄러 관리</TabsTrigger>
            <TabsTrigger value="manual">수동 실행</TabsTrigger>
            <TabsTrigger value="logs">작업 로그</TabsTrigger>
          </TabsList>

          {/* === 스케줄러 관리 탭 === */}
          <TabsContent value="scheduler">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>스케줄러 관리</CardTitle>
                  <CardDescription>배치 스케줄러의 상태를 관리합니다.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadScheduler}
                    disabled={schedulerLoading}
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${schedulerLoading ? 'animate-spin' : ''}`}
                    />
                    새로고침
                  </Button>
                  {schedulerStatus?.isRunning ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleStopScheduler}
                      disabled={schedulerActionLoading !== null}
                    >
                      {schedulerActionLoading === 'stop' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <PowerOff className="mr-2 h-4 w-4" />
                      )}
                      스케줄러 중지
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleStartScheduler}
                      disabled={schedulerActionLoading !== null}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {schedulerActionLoading === 'start' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Power className="mr-2 h-4 w-4" />
                      )}
                      스케줄러 시작
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {schedulerLoading && scheduleEntries.length === 0 ? (
                  <div className="flex h-48 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>스케줄명</TableHead>
                          <TableHead>설명</TableHead>
                          <TableHead>작업명</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>다음 실행</TableHead>
                          <TableHead>이전 실행</TableHead>
                          <TableHead className="w-28">제어</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduleEntries.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="h-24 text-center text-muted-foreground"
                            >
                              등록된 스케줄이 없습니다.
                            </TableCell>
                          </TableRow>
                        ) : (
                          scheduleEntries.map(([key, schedule]) => (
                            <TableRow key={key}>
                              <TableCell className="font-mono text-sm font-medium">
                                {schedule.triggerName}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <span>{scheduleDescriptions[schedule.triggerName] || '-'}</span>
                                  {!implementedSchedules.has(schedule.triggerName) && (
                                    <Badge className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0">
                                      미구현
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{schedule.jobName}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    triggerStateBadgeStyles[schedule.state as TriggerState] ||
                                    'bg-slate-100 text-slate-600'
                                  }
                                >
                                  {triggerStateLabels[schedule.state as TriggerState] ||
                                    schedule.state}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDateTime(schedule.nextFireTime)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDateTime(schedule.previousFireTime)}
                              </TableCell>
                              <TableCell>
                                {schedule.state === 'PAUSED' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleResumeSchedule(schedule.triggerName)}
                                    disabled={schedulerActionLoading !== null}
                                    className="text-emerald-600 hover:text-emerald-700"
                                  >
                                    {schedulerActionLoading === schedule.triggerName ? (
                                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                    ) : (
                                      <Play className="mr-1 h-4 w-4" />
                                    )}
                                    재개
                                  </Button>
                                ) : schedule.state === 'NORMAL' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePauseSchedule(schedule.triggerName)}
                                    disabled={schedulerActionLoading !== null}
                                    className="text-yellow-600 hover:text-yellow-700"
                                  >
                                    {schedulerActionLoading === schedule.triggerName ? (
                                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                    ) : (
                                      <Pause className="mr-1 h-4 w-4" />
                                    )}
                                    일시중지
                                  </Button>
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === 수동 실행 탭 === */}
          <TabsContent value="manual">
            <div className="grid gap-6 xl:grid-cols-2">
              {/* Vertex AI 예측 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Vertex AI 예측</CardTitle>
                      <CardDescription>GCP Vertex AI 기반 주가 예측 실행</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Kafka를 통해 Data Engine으로 요청되며, 실행에 3~5분 소요됩니다. GCP 환경에서만
                      실제 예측이 수행됩니다.
                    </p>
                    <Button
                      onClick={handleTriggerVertexAI}
                      disabled={actionLoading !== null}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {actionLoading === 'vertexai' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Vertex AI 예측 실행
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 종목 추천 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                      <Target className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">종목 추천</CardTitle>
                      <CardDescription>Composite Score 기반 종목 추천 생성</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="mb-1.5 text-xs">시작일 (선택)</Label>
                        <Input
                          type="date"
                          value={recoStartDate}
                          onChange={(e) => setRecoStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5 text-xs">종료일 (선택)</Label>
                        <Input
                          type="date"
                          value={recoEndDate}
                          onChange={(e) => setRecoEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      AI/기술적/감성 점수를 종합하여 매수 추천 종목을 생성합니다.
                    </p>
                    <Button
                      onClick={handleTriggerRecommendation}
                      disabled={actionLoading !== null}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {actionLoading === 'recommendation' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Target className="mr-2 h-4 w-4" />
                      )}
                      종목 추천 실행
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* 전략 백테스트 실행 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">전략 백테스트</CardTitle>
                      <CardDescription>CANONICAL 백테스트 수동 실행</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="mb-1.5 text-xs">전략 ID (특정 전략)</Label>
                        <Input
                          type="number"
                          placeholder="비우면 전체 전략"
                          value={backtestStrategyId}
                          onChange={(e) => setBacktestStrategyId(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5 text-xs">기간 (일)</Label>
                        <Input
                          type="number"
                          value={backtestPeriodDays}
                          onChange={(e) => setBacktestPeriodDays(e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      전략 ID 미입력 시 PUBLISHED 상태의 전체 전략을 실행합니다. 기본 기간: 365일.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handleRunBacktestSingle}
                        disabled={actionLoading !== null || !backtestStrategyId}
                      >
                        {actionLoading === 'backtest-single' ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="mr-2 h-4 w-4" />
                        )}
                        단일 전략 실행
                      </Button>
                      <Button
                        onClick={handleRunBacktestAll}
                        disabled={actionLoading !== null}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {actionLoading === 'backtest-all' ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="mr-2 h-4 w-4" />
                        )}
                        전체 전략 실행
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 경제 데이터 수집 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">경제 데이터 수집</CardTitle>
                      <CardDescription>FRED, Yahoo Finance 데이터 수집</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="mb-1.5 text-xs">시작일 (선택)</Label>
                        <Input
                          type="date"
                          value={collectStartDate}
                          onChange={(e) => setCollectStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5 text-xs">종료일 (선택)</Label>
                        <Input
                          type="date"
                          value={collectEndDate}
                          onChange={(e) => setCollectEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      날짜 미지정 시 마지막 수집일 다음날부터 오늘까지 자동 수집됩니다.
                    </p>
                    <Button
                      onClick={handleCollectEconomicData}
                      disabled={actionLoading !== null}
                      className="w-full"
                    >
                      {actionLoading === 'collect' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" />
                      )}
                      경제 데이터 수집 실행
                    </Button>
                  </div>

                  {/* 스케줄 정보 */}
                  {economicStatus?.schedules && economicStatus.schedules.length > 0 && (
                    <div className="mt-4 rounded-md border bg-slate-50 p-3">
                      <p className="mb-2 text-xs font-semibold text-slate-500">정기 수집 스케줄</p>
                      {economicStatus.schedules.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{s.description}</span>
                          <span className="font-mono text-xs text-slate-400">{s.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 분석 실행 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                      <BarChart3 className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">분석 실행</CardTitle>
                      <CardDescription>기술적 분석 / 감성 분석 / 병렬 분석</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="mb-1.5 text-xs">시작일 (선택)</Label>
                        <Input
                          type="date"
                          value={analysisStartDate}
                          onChange={(e) => setAnalysisStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5 text-xs">종료일 (선택)</Label>
                        <Input
                          type="date"
                          value={analysisEndDate}
                          onChange={(e) => setAnalysisEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      날짜 미지정 시 기본 분석 범위가 적용됩니다. Kafka로 비동기 요청됩니다.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handleRunTechnical}
                        disabled={actionLoading !== null}
                      >
                        {actionLoading === 'technical' ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <BarChart3 className="mr-2 h-4 w-4" />
                        )}
                        기술적 분석
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleRunSentiment}
                        disabled={actionLoading !== null}
                      >
                        {actionLoading === 'sentiment' ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Brain className="mr-2 h-4 w-4" />
                        )}
                        감성 분석
                      </Button>
                    </div>

                    <Button
                      onClick={handleRunParallel}
                      disabled={actionLoading !== null}
                      className="w-full bg-violet-600 hover:bg-violet-700"
                    >
                      {actionLoading === 'parallel' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="mr-2 h-4 w-4" />
                      )}
                      병렬 분석 실행 (기술적 + 감성 동시)
                    </Button>
                  </div>

                  {/* 분석 스케줄 정보 */}
                  {analysisStatus?.schedules && analysisStatus.schedules.length > 0 && (
                    <div className="mt-4 rounded-md border bg-slate-50 p-3">
                      <p className="mb-2 text-xs font-semibold text-slate-500">정기 분석 스케줄</p>
                      {analysisStatus.schedules.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{s.description}</span>
                          <span className="font-mono text-xs text-slate-400">{s.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* === 작업 로그 탭 === */}
          <TabsContent value="logs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>작업 로그</CardTitle>
                  <CardDescription>이번 세션에서 실행한 수동 작업 기록</CardDescription>
                </div>
                {logs.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setLogs([])}>
                    로그 초기화
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Calendar className="h-8 w-8" />
                    <p>아직 실행한 작업이 없습니다.</p>
                    <p className="text-sm">수동 실행 탭에서 작업을 실행하면 여기에 기록됩니다.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">시간</TableHead>
                          <TableHead>작업</TableHead>
                          <TableHead className="w-20">결과</TableHead>
                          <TableHead>메시지</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell>
                              {log.result === 'success' ? (
                                <div className="flex items-center gap-1 text-emerald-600">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span className="text-sm">성공</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-600">
                                  <XCircle className="h-4 w-4" />
                                  <span className="text-sm">실패</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {log.message}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
