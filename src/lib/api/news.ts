/**
 * 관리자용 뉴스 기사 API 클라이언트
 */
import { apiClient } from './client';

// === 타입 정의 ===

export type NewsSource =
  | 'SAVETICKER'
  | 'FINNHUB'
  | 'ALPHA_VANTAGE'
  | 'NAVER'
  | 'YOUTUBE'
  | 'TELEGRAM'
  | 'DART'
  | 'MANUAL';

export interface AdminNewsArticle {
  id: string;
  externalId: string;
  source: NewsSource;
  originalSource: string | null;
  titleKo: string;
  titleEn: string | null;
  contentKo: string | null;
  summaryKo: string | null;
  tags: string[];
  tickers: string[];
  importanceScore: number;
  isHeadlineOnly: boolean;
  viewCount: number;
  sourceUrl: string | null;
  isHidden: boolean;
  sourceCreatedAt: string | null;
  createdAt: string | null;
}

export interface NewsArticleListResponse {
  articles: AdminNewsArticle[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface NewsArticleStatsResponse {
  total: number;
  active: number;
  hidden: number;
  avgImportance: number;
}

export interface CreateNewsArticleRequest {
  titleKo: string;
  titleEn?: string;
  contentKo?: string;
  summaryKo?: string;
  tags?: string[];
  tickers?: string[];
  importanceScore?: number;
  sourceUrl?: string;
}

export interface UpdateNewsArticleRequest {
  titleKo?: string;
  titleEn?: string;
  summaryKo?: string;
  tags?: string[];
  tickers?: string[];
  importanceScore?: number;
}

export interface GetNewsArticlesParams {
  page?: number;
  size?: number;
  source?: NewsSource;
  tag?: string;
  ticker?: string;
  dateFrom?: string;
  dateTo?: string;
  includeHidden?: boolean;
  sortBy?: 'createdAt' | 'importanceScore' | 'viewCount';
  sortDirection?: 'asc' | 'desc';
}

// === API 함수 ===

const BASE = '/api/v1/admin/news/articles';

export async function getNewsArticles(
  params: GetNewsArticlesParams = {},
): Promise<NewsArticleListResponse> {
  return apiClient.authGet<NewsArticleListResponse>(BASE, {
    page: params.page ?? 0,
    size: params.size ?? 20,
    source: params.source,
    tag: params.tag,
    ticker: params.ticker,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    includeHidden: params.includeHidden ?? true,
    sortBy: params.sortBy ?? 'createdAt',
    sortDirection: params.sortDirection ?? 'desc',
  });
}

export async function getNewsArticleById(id: string): Promise<AdminNewsArticle> {
  return apiClient.authGet<AdminNewsArticle>(`${BASE}/${id}`);
}

export async function getNewsArticleStats(): Promise<NewsArticleStatsResponse> {
  return apiClient.authGet<NewsArticleStatsResponse>(`${BASE}/stats`);
}

export async function createNewsArticle(
  request: CreateNewsArticleRequest,
): Promise<AdminNewsArticle> {
  return apiClient.authPost<AdminNewsArticle>(BASE, request);
}

export async function updateNewsArticle(
  id: string,
  request: UpdateNewsArticleRequest,
): Promise<AdminNewsArticle> {
  return apiClient.authPatch<AdminNewsArticle>(`${BASE}/${id}`, request);
}

export async function hideNewsArticle(id: string): Promise<void> {
  return apiClient.authDelete(`${BASE}/${id}`);
}

export async function unhideNewsArticle(id: string): Promise<void> {
  return apiClient.authPatch(`${BASE}/${id}/restore`);
}

// === 유틸리티 ===

export const sourceLabels: Record<NewsSource, string> = {
  SAVETICKER: 'SaveTicker',
  FINNHUB: 'Finnhub',
  ALPHA_VANTAGE: 'Alpha Vantage',
  NAVER: '네이버',
  YOUTUBE: 'YouTube',
  TELEGRAM: '텔레그램',
  DART: 'DART',
  MANUAL: '수동 등록',
};

export const sourceColors: Record<NewsSource, string> = {
  SAVETICKER: 'text-blue-500',
  FINNHUB: 'text-green-500',
  ALPHA_VANTAGE: 'text-purple-500',
  NAVER: 'text-emerald-500',
  YOUTUBE: 'text-red-500',
  TELEGRAM: 'text-cyan-500',
  DART: 'text-orange-500',
  MANUAL: 'text-yellow-500',
};
