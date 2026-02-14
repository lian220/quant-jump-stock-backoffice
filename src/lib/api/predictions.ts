/**
 * 예측/추천 API
 * Prediction + Recommendation API 클라이언트
 */

import { apiClient } from './client';

// === 타입 정의 ===

export type CompositeGrade = 'S' | 'A' | 'B' | 'C' | 'D';
export type PriceRecommendation = '강력매수' | '매수' | '보유' | '매도';

export interface PredictionItem {
  ticker: string;
  stockName: string;
  analysisDate: string;
  compositeScore: number;
  compositeGrade: CompositeGrade;
  aiScore: number;
  techScore: number;
  sentimentScore: number;
  isRecommended: boolean;
  recommendationReason: string | null;
  currentPrice: number | null;
  targetPrice: number | null;
  upsidePercent: number | null;
  priceRecommendation: PriceRecommendation | null;
}

export interface PredictionsResponse {
  success: boolean;
  count: number;
  fromDate?: string;
  predictions: PredictionItem[];
}

export interface LatestPredictionsResponse {
  success: boolean;
  date: string;
  count: number;
  predictions: PredictionItem[];
}

export interface BuySignalsResponse {
  success: boolean;
  date: string;
  minConfidence: number;
  count: number;
  buySignals: PredictionItem[];
}

export interface PredictionStatsResponse {
  success: boolean;
  period: string;
  stats: {
    total: number;
    recommended: number;
    averageCompositeScore: string;
    gradeDistribution: Record<CompositeGrade, number>;
    uniqueTickers: number;
  };
}

// === API 함수 ===

export async function getPredictions(days: number = 7): Promise<PredictionsResponse> {
  return apiClient.get<PredictionsResponse>('/api/v1/predictions', { days });
}

export async function getLatestPredictions(): Promise<LatestPredictionsResponse> {
  return apiClient.get<LatestPredictionsResponse>('/api/v1/predictions/latest');
}

export async function getBuySignals(
  date?: string,
  minConfidence: number = 0.7,
): Promise<BuySignalsResponse> {
  return apiClient.get<BuySignalsResponse>('/api/v1/predictions/buy-signals', {
    date,
    minConfidence,
  });
}

export async function getPredictionsBySymbol(
  symbol: string,
  limit: number = 10,
): Promise<PredictionsResponse> {
  return apiClient.get<PredictionsResponse>(`/api/v1/predictions/${symbol}`, { limit });
}

export async function getPredictionsByDate(date: string): Promise<PredictionsResponse> {
  return apiClient.get<PredictionsResponse>(`/api/v1/predictions/date/${date}`);
}

export async function getPredictionStats(days: number = 7): Promise<PredictionStatsResponse> {
  return apiClient.get<PredictionStatsResponse>('/api/v1/predictions/stats', { days });
}

// Recommendation API (별도 경로)
export async function getRecommendationBuySignals(
  date?: string,
  minConfidence: number = 0.7,
): Promise<BuySignalsResponse> {
  return apiClient.get<BuySignalsResponse>('/api/predictions/buy-signals', {
    date,
    minConfidence,
  });
}

// === 유틸리티 상수 ===

export const gradeLabels: Record<CompositeGrade, string> = {
  S: 'S등급',
  A: 'A등급',
  B: 'B등급',
  C: 'C등급',
  D: 'D등급',
};

export const gradeBadgeStyles: Record<CompositeGrade, string> = {
  S: 'bg-purple-100 text-purple-700 border-purple-200',
  A: 'bg-blue-100 text-blue-700 border-blue-200',
  B: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  C: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  D: 'bg-red-100 text-red-700 border-red-200',
};

export const priceRecommendationStyles: Record<string, string> = {
  강력매수: 'bg-purple-100 text-purple-700',
  매수: 'bg-emerald-100 text-emerald-700',
  보유: 'bg-slate-100 text-slate-700',
  매도: 'bg-red-100 text-red-700',
};
