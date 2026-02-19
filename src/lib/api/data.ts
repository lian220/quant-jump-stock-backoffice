/**
 * 데이터 관리 API
 * 경제 데이터 수집 + 분석 실행 API 클라이언트
 */

import { apiClient } from './client';

// === 타입 정의 ===

export interface CollectionResponse {
  success: boolean;
  message: string;
  startDate?: string;
  endDate?: string;
  timestamp: string;
}

export interface DataStatusSchedule {
  name: string;
  time: string;
  description: string;
}

export interface DataStatusResponse {
  status: string;
  service: string;
  timestamp: string;
  schedules: DataStatusSchedule[];
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  analysisType: string;
  startDate?: string;
  endDate?: string;
  timestamp: string;
}

export interface AnalysisStatusResponse {
  status: string;
  service: string;
  timestamp: string;
  schedules: DataStatusSchedule[];
  availableEndpoints: string[];
}

// === 경제 데이터 API ===

export async function collectEconomicData(
  startDate?: string,
  endDate?: string,
): Promise<CollectionResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString();
  return apiClient.authPost<CollectionResponse>(
    `/api/v1/admin/economic-data/collections${query ? `?${query}` : ''}`,
  );
}

export async function getEconomicDataStatus(): Promise<DataStatusResponse> {
  return apiClient.get<DataStatusResponse>('/api/v1/admin/economic-data/status');
}

// === 분석 API ===

export async function runTechnicalAnalysis(
  startDate?: string,
  endDate?: string,
): Promise<AnalysisResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString();
  return apiClient.authPost<AnalysisResponse>(
    `/api/v1/admin/analyses/technical${query ? `?${query}` : ''}`,
  );
}

export async function runSentimentAnalysis(
  startDate?: string,
  endDate?: string,
): Promise<AnalysisResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString();
  return apiClient.authPost<AnalysisResponse>(
    `/api/v1/admin/analyses/sentiment${query ? `?${query}` : ''}`,
  );
}

export async function runParallelAnalysis(
  startDate?: string,
  endDate?: string,
): Promise<AnalysisResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString();
  return apiClient.authPost<AnalysisResponse>(
    `/api/v1/admin/analyses/parallel${query ? `?${query}` : ''}`,
  );
}

export async function getAnalysisStatus(): Promise<AnalysisStatusResponse> {
  return apiClient.get<AnalysisStatusResponse>('/api/v1/admin/analyses/status');
}

// === Vertex AI 예측 API ===

export interface VertexAIPredictionResponse {
  success: boolean;
  message: string;
  requestId?: string;
  estimatedTime?: string;
  note?: string;
}

export async function triggerVertexAIPrediction(): Promise<VertexAIPredictionResponse> {
  return apiClient.authPost<VertexAIPredictionResponse>('/api/v1/admin/vertex-ai/predict');
}

// === 종목 추천 API ===

export async function triggerStockRecommendation(
  startDate?: string,
  endDate?: string,
): Promise<AnalysisResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString();
  return apiClient.authPost<AnalysisResponse>(
    `/api/v1/admin/analyses/recommendation${query ? `?${query}` : ''}`,
  );
}

// === 관리자 백테스트 API ===

export interface AdminBacktestResponse {
  success: boolean;
  message: string;
  strategyId?: number;
  strategyName?: string;
  requestId?: string;
  totalRequested?: number;
  results?: Array<{
    strategyId: number;
    strategyName: string;
    requestId: string;
    status: string;
  }>;
}

export async function runAdminBacktestAll(
  periodDays?: number,
  benchmark?: string,
  initialCapital?: number,
): Promise<AdminBacktestResponse> {
  return apiClient.authPost<AdminBacktestResponse>('/api/v1/admin/backtest/run-all', {
    periodDays,
    benchmark,
    initialCapital,
  });
}

export async function runAdminBacktestByStrategy(
  strategyId: number,
  periodDays?: number,
  benchmark?: string,
  initialCapital?: number,
): Promise<AdminBacktestResponse> {
  return apiClient.authPost<AdminBacktestResponse>(`/api/v1/admin/backtest/run/${strategyId}`, {
    periodDays,
    benchmark,
    initialCapital,
  });
}
