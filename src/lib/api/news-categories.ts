/**
 * 관리자용 뉴스 카테고리 API 클라이언트
 */
import { apiClient } from './client';

// === 타입 정의 ===

export interface AdminCategory {
  id: number;
  name: string;
  nameEn: string;
  group: string;
  description: string | null;
  icon: string | null;
  weight: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string | null;
}

export interface AdminCategoryListResponse {
  categories: AdminCategory[];
  total: number;
}

export interface CreateCategoryRequest {
  name: string;
  nameEn: string;
  group: string;
  description?: string;
  icon?: string;
  weight?: number;
  sortOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  nameEn?: string;
  group?: string;
  description?: string;
  icon?: string;
  weight?: number;
  sortOrder?: number;
  isActive?: boolean;
}

// === API 함수 ===

const BASE = '/api/v1/admin/news/categories';

export async function getAdminCategories(
  includeInactive = true,
): Promise<AdminCategoryListResponse> {
  return apiClient.authGet<AdminCategoryListResponse>(BASE, { includeInactive });
}

export async function createCategory(request: CreateCategoryRequest): Promise<AdminCategory> {
  return apiClient.authPost<AdminCategory>(BASE, request);
}

export async function updateCategory(
  id: number,
  request: UpdateCategoryRequest,
): Promise<AdminCategory> {
  return apiClient.authPatch<AdminCategory>(`${BASE}/${id}`, request);
}

export async function toggleCategory(id: number): Promise<AdminCategory> {
  return apiClient.authPatch<AdminCategory>(`${BASE}/${id}/toggle`);
}

export async function deleteCategory(id: number): Promise<void> {
  return apiClient.authDelete(`${BASE}/${id}`);
}

// === 유틸리티 ===

export const GROUP_LABELS: Record<string, string> = {
  MARKET: '시장',
  COMPANY: '기업',
  MACRO: '매크로',
  ASSET: '자산',
  INFO: '정보',
};

export function getGroupLabel(group: string): string {
  return GROUP_LABELS[group] || group;
}
