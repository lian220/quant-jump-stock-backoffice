import { apiClient } from './client';

// --- 공통 티어 타입 ---

export type Tier = 'FREE' | 'PREMIUM' | 'PREMIUM_YEARLY';

// --- 타입 ---

export interface TierConfiguration {
  tier: Tier;
  maxSubscriptionCount: number;
  maxBacktestDaily: number;
  maxBacktestPerStrategy: number;
  isUnlimitedSubscription: boolean;
  isUnlimitedBacktest: boolean;
  description: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface UpdateTierConfigRequest {
  maxSubscriptionCount?: number;
  maxBacktestDaily?: number;
  maxBacktestPerStrategy?: number;
  isUnlimitedSubscription?: boolean;
  isUnlimitedBacktest?: boolean;
  description?: string;
}

// --- API 함수 ---

export async function getTierConfigurations(): Promise<TierConfiguration[]> {
  return apiClient.authGet<TierConfiguration[]>('/api/v1/admin/tier-configurations');
}

export async function updateTierConfiguration(
  tier: string,
  data: UpdateTierConfigRequest,
): Promise<TierConfiguration> {
  return apiClient.authPatch<TierConfiguration>(`/api/v1/admin/tier-configurations/${tier}`, data);
}

// --- 표시용 상수 ---

export const tierLabels: Record<Tier, string> = {
  FREE: '무료',
  PREMIUM: '프리미엄',
  PREMIUM_YEARLY: '프리미엄 연간',
};

export const tierColors: Record<Tier, string> = {
  FREE: 'bg-gray-500',
  PREMIUM: 'bg-emerald-500',
  PREMIUM_YEARLY: 'bg-purple-500',
};
