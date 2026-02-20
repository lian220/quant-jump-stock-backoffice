import { apiClient } from './client';
import { type Tier } from './tier-config';

// --- 타입 ---

export interface AdminUserTierInfo {
  userId: number;
  userLoginId: string;
  tier: Tier;
  startedAt: string | null;
  expiresAt: string | null;
  backtestCountToday: number;
  activeSubscriptionCount: number;
}

export interface UpdateUserTierRequest {
  tier: Tier;
  expiresAt?: string | null;
}

export interface AdminUserPreferences {
  investmentCategories: string[];
  markets: string[];
  riskTolerance: string | null;
}

export interface AdminUser {
  id: number;
  userId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  role: string;
  oauthProvider: string | null;
  preferences: AdminUserPreferences | null;
  createdAt: string;
}

export interface AdminUserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

export interface UserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  stats: AdminUserStats;
}

export interface UserListParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}

// --- API 함수 ---

export async function getUsers(params: UserListParams = {}): Promise<UserListResponse> {
  return apiClient.authGet<UserListResponse>('/api/v1/admin/users', {
    page: params.page ?? 0,
    size: params.size ?? 20,
    search: params.search || undefined,
    status: params.status || undefined,
  });
}

export async function getUserTier(userId: number): Promise<AdminUserTierInfo> {
  return apiClient.authGet<AdminUserTierInfo>(`/api/v1/admin/users/${userId}/tier`);
}

export async function getUserTiersBatch(userIds: number[]): Promise<AdminUserTierInfo[]> {
  if (userIds.length === 0) return [];
  return apiClient.authGet<AdminUserTierInfo[]>('/api/v1/admin/users/tiers/batch', {
    userIds: userIds.join(','),
  });
}

export async function updateUserTier(
  userId: number,
  request: UpdateUserTierRequest,
): Promise<AdminUserTierInfo> {
  return apiClient.authPatch<AdminUserTierInfo>(`/api/v1/admin/users/${userId}/tier`, request);
}

// --- 표시용 상수 ---

export const statusLabels: Record<string, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  SUSPENDED: '정지',
};

export const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-500',
  INACTIVE: 'bg-gray-500',
  SUSPENDED: 'bg-red-500',
};

export const roleLabels: Record<string, string> = {
  ADMIN: '관리자',
  USER: '사용자',
  MODERATOR: '모더레이터',
};

export const categoryLabels: Record<string, string> = {
  value: '가치투자',
  momentum: '모멘텀',
  asset_allocation: '자산배분',
  quant_composite: '퀀트 복합',
  seasonal: '시즌널',
  ml_prediction: 'AI 예측',
};

export const riskLabels: Record<string, string> = {
  low: '안정형',
  medium: '균형형',
  high: '공격형',
};
