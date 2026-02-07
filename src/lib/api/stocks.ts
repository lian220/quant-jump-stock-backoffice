/**
 * 종목 관리 API
 * 백오피스용 종목 마스터 관리 API 클라이언트
 */

import { apiClient } from './client';

// === 타입 정의 ===

export type Market = 'US' | 'KR' | 'CRYPTO';
export type DesignationStatus = 'NORMAL' | 'CAUTION' | 'WARNING' | 'DANGER' | 'DELISTED';

export interface StockSummary {
  id: number;
  ticker: string;
  stockName: string;
  stockNameEn: string | null;
  market: Market;
  sector: string | null;
  isEtf: boolean;
  designationStatus: DesignationStatus;
  isActive: boolean;
}

export interface StockDetailResponse {
  id: number;
  ticker: string;
  stockName: string;
  stockNameEn: string | null;
  exchange: string | null;
  sector: string | null;
  industry: string | null;
  market: Market;
  isEtf: boolean;
  leverageTicker: string | null;
  designationStatus: DesignationStatus;
  designationReason: string | null;
  designatedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockSearchResponse {
  stocks: StockSummary[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface StockResponse {
  success: boolean;
  stockId: number | null;
  message: string | null;
}

export interface CreateStockRequest {
  ticker: string;
  stockName: string;
  stockNameEn?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  market?: Market;
  isEtf?: boolean;
  leverageTicker?: string;
}

export interface UpdateStockRequest {
  stockName?: string;
  stockNameEn?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  market?: Market;
  isEtf?: boolean;
  leverageTicker?: string;
  isActive?: boolean;
}

export interface ChangeDesignationRequest {
  designationStatus: DesignationStatus;
  reason?: string;
}

export interface DesignationHistoryResponse {
  id: number;
  previousStatus: DesignationStatus;
  newStatus: DesignationStatus;
  reason: string | null;
  changedBy: number | null;
  changedAt: string;
}

export interface GetStocksParams {
  query?: string;
  market?: Market;
  sector?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
}

// === API 함수 ===

export async function getStocks(params: GetStocksParams = {}): Promise<StockSearchResponse> {
  return apiClient.get<StockSearchResponse>('/api/v1/stocks', {
    query: params.query,
    market: params.market,
    sector: params.sector,
    isActive: params.isActive,
    page: params.page ?? 0,
    size: params.size ?? 20,
  });
}

export async function getStock(id: number): Promise<StockDetailResponse> {
  return apiClient.get<StockDetailResponse>(`/api/v1/stocks/${id}`);
}

export async function createStock(request: CreateStockRequest): Promise<StockResponse> {
  return apiClient.authPost<StockResponse>('/api/v1/admin/stocks', request);
}

export async function updateStock(id: number, request: UpdateStockRequest): Promise<StockResponse> {
  return apiClient.authPut<StockResponse>(`/api/v1/admin/stocks/${id}`, request);
}

export async function deleteStock(id: number): Promise<StockResponse> {
  return apiClient.authDelete<StockResponse>(`/api/v1/admin/stocks/${id}`);
}

export async function changeDesignation(
  id: number,
  request: ChangeDesignationRequest,
): Promise<StockResponse> {
  return apiClient.authPut<StockResponse>(`/api/v1/admin/stocks/${id}/designation`, request);
}

export async function getDesignationHistory(id: number): Promise<DesignationHistoryResponse[]> {
  return apiClient.authGet<DesignationHistoryResponse[]>(
    `/api/v1/admin/stocks/${id}/designation-history`,
  );
}

// === 유틸리티 상수 ===

export const marketLabels: Record<Market, string> = {
  US: '미국',
  KR: '한국',
  CRYPTO: '암호화폐',
};

export const designationLabels: Record<DesignationStatus, string> = {
  NORMAL: '정상',
  CAUTION: '주의',
  WARNING: '경고',
  DANGER: '위험',
  DELISTED: '상장폐지',
};

export const designationColors: Record<DesignationStatus, string> = {
  NORMAL: 'text-emerald-400',
  CAUTION: 'text-yellow-400',
  WARNING: 'text-orange-400',
  DANGER: 'text-red-400',
  DELISTED: 'text-slate-500',
};

export const designationBgColors: Record<DesignationStatus, string> = {
  NORMAL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CAUTION: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  WARNING: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  DANGER: 'bg-red-500/10 text-red-400 border-red-500/20',
  DELISTED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export const marketOptions: { value: Market; label: string }[] = [
  { value: 'KR', label: '한국' },
  { value: 'US', label: '미국' },
  { value: 'CRYPTO', label: '암호화폐' },
];

export const designationOptions: { value: DesignationStatus; label: string }[] = [
  { value: 'NORMAL', label: '정상' },
  { value: 'CAUTION', label: '주의' },
  { value: 'WARNING', label: '경고' },
  { value: 'DANGER', label: '위험' },
  { value: 'DELISTED', label: '상장폐지' },
];
