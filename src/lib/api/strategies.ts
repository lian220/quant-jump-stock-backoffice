/**
 * 전략 관리 API
 * 백오피스용 전략 관리 API 클라이언트
 */

import { apiClient } from './client';

// === 타입 정의 ===

/**
 * 전략 상태
 */
export type StrategyStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ACTIVE'
  | 'ARCHIVED';

/**
 * 리밸런싱 주기
 */
export type RebalanceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'NONE';

/**
 * 전략 요약 (목록용)
 */
export interface StrategySummary {
  id: number;
  name: string;
  description: string | null;
  categoryCode: string;
  categoryName: string;
  ownerId: number | null;
  ownerName: string | null;
  ownerEmail: string | null;
  status: StrategyStatus;
  isPublic: boolean;
  isPremium: boolean;
  rebalanceFrequency: RebalanceFrequency;
  subscriberCount: number;
  averageRating: number;
  latestCagr: number | null;
  latestMdd: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 전략 목록 응답
 */
export interface StrategyListResponse {
  strategies: StrategySummary[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/**
 * 전략 통계 응답
 */
export interface StrategyStatsResponse {
  total: number;
  pendingReview: number;
  published: number;
  totalSubscribers: number;
}

/**
 * 상태 변경 요청
 */
export interface ChangeStatusRequest {
  status: StrategyStatus;
  reason?: string;
}

/**
 * 상태 변경 응답
 */
export interface ChangeStatusResponse {
  success: boolean;
  strategyId: number;
  previousStatus: StrategyStatus;
  newStatus: StrategyStatus;
  message: string | null;
}

/**
 * 전략 목록 조회 파라미터
 */
export interface GetStrategiesParams {
  page?: number;
  size?: number;
  status?: StrategyStatus;
  categoryCode?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'subscriberCount';
  sortDirection?: 'asc' | 'desc';
}

// === API 함수 ===

/**
 * 전략 목록 조회
 */
export async function getStrategies(
  params: GetStrategiesParams = {},
): Promise<StrategyListResponse> {
  return apiClient.get<StrategyListResponse>('/api/v1/admin/strategies', {
    page: params.page ?? 0,
    size: params.size ?? 20,
    status: params.status,
    categoryCode: params.categoryCode,
    sortBy: params.sortBy ?? 'createdAt',
    sortDirection: params.sortDirection ?? 'desc',
  });
}

/**
 * 전략 통계 조회
 */
export async function getStrategyStats(): Promise<StrategyStatsResponse> {
  return apiClient.get<StrategyStatsResponse>('/api/v1/admin/strategies/stats');
}

/**
 * 전략 상태 변경
 */
export async function changeStrategyStatus(
  strategyId: number,
  request: ChangeStatusRequest,
): Promise<ChangeStatusResponse> {
  return apiClient.patch<ChangeStatusResponse>(
    `/api/v1/admin/strategies/${strategyId}/status`,
    request,
  );
}

/**
 * 전략 승인
 */
export async function approveStrategy(strategyId: number): Promise<ChangeStatusResponse> {
  return apiClient.post<ChangeStatusResponse>(`/api/v1/admin/strategies/${strategyId}/approve`);
}

/**
 * 전략 반려
 */
export async function rejectStrategy(
  strategyId: number,
  reason?: string,
): Promise<ChangeStatusResponse> {
  const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
  return apiClient.post<ChangeStatusResponse>(
    `/api/v1/admin/strategies/${strategyId}/reject${params}`,
  );
}

/**
 * 전략 발행
 */
export async function publishStrategy(strategyId: number): Promise<ChangeStatusResponse> {
  return apiClient.post<ChangeStatusResponse>(`/api/v1/admin/strategies/${strategyId}/publish`);
}

// === 상태 유틸리티 ===

/**
 * 상태별 레이블
 */
export const statusLabels: Record<StrategyStatus, string> = {
  DRAFT: '초안',
  PENDING_REVIEW: '검토 대기',
  APPROVED: '승인됨',
  PUBLISHED: '발행됨',
  REJECTED: '반려됨',
  ACTIVE: '활성',
  ARCHIVED: '보관됨',
};

/**
 * 상태별 색상 (Tailwind CSS)
 */
export const statusColors: Record<StrategyStatus, string> = {
  DRAFT: 'text-slate-400',
  PENDING_REVIEW: 'text-yellow-500',
  APPROVED: 'text-blue-500',
  PUBLISHED: 'text-green-500',
  REJECTED: 'text-red-500',
  ACTIVE: 'text-emerald-500',
  ARCHIVED: 'text-gray-500',
};

/**
 * 상태별 Badge variant
 */
export const statusVariants: Record<
  StrategyStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  DRAFT: 'outline',
  PENDING_REVIEW: 'secondary',
  APPROVED: 'default',
  PUBLISHED: 'default',
  REJECTED: 'destructive',
  ACTIVE: 'default',
  ARCHIVED: 'outline',
};

// === 전략 CRUD API 타입 ===

/**
 * 카테고리 정보
 */
export interface CategoryInfo {
  id: number;
  code: string;
  name: string;
}

/**
 * 전략 생성 요청
 */
export interface CreateStrategyRequest {
  name: string;
  description?: string;
  categoryCode: string;
  isPublic?: boolean;
  isPremium?: boolean;
  conditions?: string;
  rebalanceFrequency?: RebalanceFrequency;
}

/**
 * 전략 수정 요청
 */
export interface UpdateStrategyRequest {
  name?: string;
  description?: string;
  categoryCode?: string;
  isPublic?: boolean;
  isPremium?: boolean;
  status?: StrategyStatus;
  conditions?: string;
  rebalanceFrequency?: RebalanceFrequency;
}

/**
 * 백테스트 결과 요약
 */
export interface BacktestResultSummary {
  id: number;
  cagr: number;
  mdd: number;
  sharpeRatio: number | null;
  totalReturn: number;
  status: string;
  startDate: string;
  endDate: string;
}

/**
 * 전략 상세 응답
 */
export interface StrategyDetailResponse {
  id: number;
  name: string;
  description: string | null;
  category: CategoryInfo;
  ownerId: number | null;
  ownerName: string | null;
  isPublic: boolean;
  isPremium: boolean;
  status: StrategyStatus;
  conditions: string;
  rebalanceFrequency: RebalanceFrequency;
  subscriberCount: number;
  averageRating: number;
  backtestResults: BacktestResultSummary[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 전략 CRUD 응답
 */
export interface StrategyResponse {
  success: boolean;
  strategyId?: number;
  message?: string;
}

/**
 * 내 전략 목록 아이템
 */
export interface MyStrategySummary {
  id: number;
  name: string;
  category: CategoryInfo;
  status: StrategyStatus;
  isPublic: boolean;
  isPremium: boolean;
  subscriberCount: number;
  averageRating: number;
  latestCagr: number | null;
  latestMdd: number | null;
  createdAt: string;
}

/**
 * 내 전략 목록 응답
 */
export interface MyStrategiesResponse {
  strategies: MyStrategySummary[];
  total: number;
}

// === 전략 CRUD API 함수 ===

/**
 * 전략 상세 조회
 */
export async function getStrategyDetail(strategyId: number): Promise<StrategyDetailResponse> {
  return apiClient.authGet<StrategyDetailResponse>(`/api/v1/strategies/${strategyId}`);
}

/**
 * 전략 생성
 */
export async function createStrategy(request: CreateStrategyRequest): Promise<StrategyResponse> {
  return apiClient.authPost<StrategyResponse>('/api/v1/strategies', request);
}

/**
 * 전략 수정
 */
export async function updateStrategy(
  strategyId: number,
  request: UpdateStrategyRequest,
): Promise<StrategyResponse> {
  return apiClient.authPut<StrategyResponse>(`/api/v1/strategies/${strategyId}`, request);
}

/**
 * 전략 삭제
 */
export async function deleteStrategy(strategyId: number): Promise<StrategyResponse> {
  return apiClient.authDelete<StrategyResponse>(`/api/v1/strategies/${strategyId}`);
}

/**
 * 내 전략 목록 조회
 */
export async function getMyStrategies(): Promise<MyStrategiesResponse> {
  return apiClient.authGet<MyStrategiesResponse>('/api/v1/strategies/me');
}

// === 카테고리 유틸리티 ===

/**
 * 카테고리 코드 목록
 */
export const categoryOptions = [
  { code: 'MOMENTUM', name: '모멘텀' },
  { code: 'VALUE', name: '가치' },
  { code: 'ASSET_ALLOCATION', name: '자산배분' },
  { code: 'QUANT_COMPOSITE', name: '복합' },
  { code: 'SEASONAL', name: '시즌' },
  { code: 'ML_PREDICTION', name: 'AI/ML' },
  { code: 'CUSTOM', name: '커스텀' },
];

/**
 * 리밸런싱 주기 옵션
 */
export const rebalanceOptions = [
  { code: 'DAILY', name: '일간' },
  { code: 'WEEKLY', name: '주간' },
  { code: 'MONTHLY', name: '월간' },
  { code: 'QUARTERLY', name: '분기' },
  { code: 'YEARLY', name: '연간' },
  { code: 'NONE', name: '없음' },
];
