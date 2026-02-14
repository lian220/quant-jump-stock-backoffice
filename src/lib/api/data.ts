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
  return apiClient.authPost<CollectionResponse>('/api/v1/economic-data/collections', {
    startDate,
    endDate,
  });
}

export async function getEconomicDataStatus(): Promise<DataStatusResponse> {
  return apiClient.get<DataStatusResponse>('/api/v1/economic-data/status');
}

// === 분석 API ===

export async function runTechnicalAnalysis(
  startDate?: string,
  endDate?: string,
): Promise<AnalysisResponse> {
  return apiClient.authPost<AnalysisResponse>('/api/v1/analyses/technical', {
    startDate,
    endDate,
  });
}

export async function runSentimentAnalysis(
  startDate?: string,
  endDate?: string,
): Promise<AnalysisResponse> {
  return apiClient.authPost<AnalysisResponse>('/api/v1/analyses/sentiment', {
    startDate,
    endDate,
  });
}

export async function runParallelAnalysis(): Promise<AnalysisResponse> {
  return apiClient.authPost<AnalysisResponse>('/api/v1/analyses/parallel');
}

export async function getAnalysisStatus(): Promise<AnalysisStatusResponse> {
  return apiClient.get<AnalysisStatusResponse>('/api/v1/analyses/status');
}
