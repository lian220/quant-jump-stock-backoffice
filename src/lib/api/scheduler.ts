/**
 * 스케줄러 관리 API
 * 백오피스용 스케줄러 상태 조회 및 제어 API 클라이언트
 */

import { apiClient } from './client';

// === 타입 정의 ===

export type TriggerState = 'NORMAL' | 'PAUSED' | 'COMPLETE' | 'ERROR' | 'BLOCKED';

export interface SchedulerStatus {
  isRunning: boolean;
  scheduledJobCount: number;
  activeTriggerCount: number;
}

export interface ScheduleInfo {
  triggerName: string;
  jobName: string;
  nextFireTime: string | null;
  previousFireTime: string | null;
  state: TriggerState;
}

export interface SchedulerActionResponse {
  success: boolean;
  message: string;
}

// === API 함수 ===

export async function getSchedulerStatus(): Promise<SchedulerStatus> {
  return apiClient.authGet<SchedulerStatus>('/api/v1/scheduler/status');
}

export async function getSchedules(): Promise<Record<string, ScheduleInfo>> {
  return apiClient.authGet<Record<string, ScheduleInfo>>('/api/v1/scheduler/schedules');
}

export async function pauseSchedule(triggerName: string): Promise<SchedulerActionResponse> {
  return apiClient.authPost<SchedulerActionResponse>(
    `/api/v1/scheduler/schedules/${triggerName}/pause`,
  );
}

export async function resumeSchedule(triggerName: string): Promise<SchedulerActionResponse> {
  return apiClient.authPost<SchedulerActionResponse>(
    `/api/v1/scheduler/schedules/${triggerName}/resume`,
  );
}

export async function startScheduler(): Promise<SchedulerActionResponse> {
  return apiClient.authPost<SchedulerActionResponse>('/api/v1/scheduler/start');
}

export async function stopScheduler(): Promise<SchedulerActionResponse> {
  return apiClient.authPost<SchedulerActionResponse>('/api/v1/scheduler/stop');
}

// === 유틸리티 상수 ===

export const triggerStateLabels: Record<TriggerState, string> = {
  NORMAL: '정상',
  PAUSED: '일시중지',
  COMPLETE: '완료',
  ERROR: '오류',
  BLOCKED: '차단됨',
};

export const triggerStateBadgeStyles: Record<TriggerState, string> = {
  NORMAL: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  PAUSED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  COMPLETE: 'bg-slate-100 text-slate-600 border-slate-200',
  ERROR: 'bg-red-100 text-red-700 border-red-200',
  BLOCKED: 'bg-orange-100 text-orange-700 border-orange-200',
};

export const scheduleDescriptions: Record<string, string> = {
  economicDataUpdateTrigger: '경제 데이터 수집 (06:05 KST)',
  economicDataUpdate2Trigger: '경제 데이터 재수집 (23:00 KST)',
  parallelAnalysisTrigger: '병렬 분석 - 기술적 + 감성 (23:30 KST)',
  vertexAIPredictionTrigger: 'Vertex AI 예측 (23:45 KST)',
  autoBuyTrigger: '자동 매수 (00:30 KST)',
  autoSellTrigger: '자동 매도 체크 (매 1분)',
  stockRecommendationTrigger: '종목 추천 (00:20 KST)',
  cleanupOrdersTrigger: '주문 정리 (06:30 KST)',
  portfolioProfitReportTrigger: '포트폴리오 수익 보고 (07:00 KST)',
};

// 실제 구현된 스케줄러 (미구현은 표시용)
export const implementedSchedules = new Set([
  'economicDataUpdateTrigger',
  'economicDataUpdate2Trigger',
  'parallelAnalysisTrigger',
  'vertexAIPredictionTrigger',
]);

// 미구현 스케줄러
export const unimplementedSchedules = new Set([
  'autoBuyTrigger',
  'autoSellTrigger',
  'stockRecommendationTrigger',
  'cleanupOrdersTrigger',
  'portfolioProfitReportTrigger',
]);
