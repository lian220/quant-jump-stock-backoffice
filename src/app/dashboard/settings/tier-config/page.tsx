'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  getTierConfigurations,
  updateTierConfiguration,
  tierLabels,
  tierColors,
  type TierConfiguration,
  type UpdateTierConfigRequest,
} from '@/lib/api/tier-config';

interface TierCardState {
  config: TierConfiguration;
  editing: UpdateTierConfigRequest;
  saving: boolean;
  saved: boolean;
  error: string | null;
}

export default function TierConfigPage() {
  const [tiers, setTiers] = useState<TierCardState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const configs = await getTierConfigurations();
      // FREE → PREMIUM → PREMIUM_YEARLY 순 정렬
      const order = ['FREE', 'PREMIUM', 'PREMIUM_YEARLY'];
      configs.sort((a, b) => order.indexOf(a.tier) - order.indexOf(b.tier));
      setTiers(
        configs.map((c) => ({
          config: c,
          editing: {
            maxSubscriptionCount: c.maxSubscriptionCount,
            maxBacktestDaily: c.maxBacktestDaily,
            maxBacktestPerStrategy: c.maxBacktestPerStrategy,
            isUnlimitedSubscription: c.isUnlimitedSubscription,
            isUnlimitedBacktest: c.isUnlimitedBacktest,
            description: c.description ?? '',
          },
          saving: false,
          saved: false,
          error: null,
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '티어 설정을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const tiersRef = useRef(tiers);
  tiersRef.current = tiers;

  const updateEditing = (
    tierValue: string,
    field: keyof UpdateTierConfigRequest,
    value: number | boolean | string,
  ) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.config.tier === tierValue
          ? { ...t, editing: { ...t.editing, [field]: value }, saved: false, error: null }
          : t,
      ),
    );
  };

  const handleSave = async (tierValue: string) => {
    const state = tiersRef.current.find((t) => t.config.tier === tierValue);
    if (!state) return;
    const editingSnapshot = { ...state.editing };

    setTiers((prev) =>
      prev.map((t) => (t.config.tier === tierValue ? { ...t, saving: true, error: null } : t)),
    );
    try {
      const updated = await updateTierConfiguration(tierValue, editingSnapshot);
      setTiers((prev) =>
        prev.map((t) =>
          t.config.tier === tierValue
            ? { ...t, config: updated, saving: false, saved: true, error: null }
            : t,
        ),
      );
    } catch (err) {
      setTiers((prev) =>
        prev.map((t) =>
          t.config.tier === tierValue
            ? {
                ...t,
                saving: false,
                error: err instanceof Error ? err.message : '저장에 실패했습니다.',
              }
            : t,
        ),
      );
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString('ko-KR');
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <>
        <Header title="티어 설정" />
        <div className="flex items-center justify-center p-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="티어 설정" />
        <div className="p-6">
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
          <Button variant="outline" className="mt-4" onClick={fetchConfigs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="티어 설정" />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              각 구독 티어별 기능 제한을 설정합니다. 변경 사항은 즉시 반영됩니다.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchConfigs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((state) => {
            const { config, editing, saving, saved, error: cardError } = state;
            const tierLabel = tierLabels[config.tier] ?? config.tier;
            const tierColor = tierColors[config.tier] ?? 'bg-gray-500';

            return (
              <Card key={config.tier} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tierLabel}</CardTitle>
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${tierColor}`}
                      title={config.tier}
                    />
                  </div>
                  <CardDescription>
                    <Badge variant="outline" className="text-xs font-mono">
                      {config.tier}
                    </Badge>
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-5">
                  {/* 무제한 토글 */}
                  <div className="space-y-3 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`unlimitedSub-${config.tier}`} className="text-sm">
                        구독 무제한
                      </Label>
                      <Switch
                        id={`unlimitedSub-${config.tier}`}
                        checked={editing.isUnlimitedSubscription}
                        onCheckedChange={(v) =>
                          updateEditing(config.tier, 'isUnlimitedSubscription', v)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`unlimitedBt-${config.tier}`} className="text-sm">
                        백테스트 무제한
                      </Label>
                      <Switch
                        id={`unlimitedBt-${config.tier}`}
                        checked={editing.isUnlimitedBacktest}
                        onCheckedChange={(v) =>
                          updateEditing(config.tier, 'isUnlimitedBacktest', v)
                        }
                      />
                    </div>
                  </div>

                  {/* 수치 제한 */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">전략 구독 최대 수</Label>
                      <Input
                        type="number"
                        min={0}
                        value={editing.maxSubscriptionCount}
                        onChange={(e) =>
                          updateEditing(config.tier, 'maxSubscriptionCount', Number(e.target.value))
                        }
                        disabled={editing.isUnlimitedSubscription}
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">일일 백테스트 최대 수</Label>
                      <Input
                        type="number"
                        min={0}
                        value={editing.maxBacktestDaily}
                        onChange={(e) =>
                          updateEditing(config.tier, 'maxBacktestDaily', Number(e.target.value))
                        }
                        disabled={editing.isUnlimitedBacktest}
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        전략당 백테스트 보관 수
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={editing.maxBacktestPerStrategy}
                        onChange={(e) =>
                          updateEditing(
                            config.tier,
                            'maxBacktestPerStrategy',
                            Number(e.target.value),
                          )
                        }
                        disabled={editing.isUnlimitedBacktest}
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">설명</Label>
                      <Input
                        value={editing.description}
                        onChange={(e) => updateEditing(config.tier, 'description', e.target.value)}
                        placeholder="티어 설명 (선택)"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  {/* 마지막 수정 정보 */}
                  {config.updatedAt && (
                    <p className="text-xs text-muted-foreground">
                      최종 수정: {formatDate(config.updatedAt)}
                      {config.updatedBy && ` · ${config.updatedBy}`}
                    </p>
                  )}

                  {/* 에러 */}
                  {cardError && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      {cardError}
                    </p>
                  )}

                  {/* 저장 버튼 */}
                  <Button
                    className="mt-auto"
                    onClick={() => handleSave(config.tier)}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {saved ? '저장됨 ✓' : '저장'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
