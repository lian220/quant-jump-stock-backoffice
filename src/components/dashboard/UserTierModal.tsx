'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUserTier, type AdminUserTierInfo } from '@/lib/api/users';
import { type Tier } from '@/lib/api/tier-config';

interface Props {
  userId: number;
  currentTier: Tier;
  userLoginId: string;
  onClose: () => void;
  onSuccess: (info: AdminUserTierInfo) => void;
}

const TIER_OPTIONS: { value: Tier; label: string; description: string }[] = [
  { value: 'FREE', label: '무료 (FREE)', description: '일일 백테스트 3회, 전략 구독 3개' },
  { value: 'PREMIUM', label: '프리미엄 (PREMIUM)', description: '무제한 백테스트, 무제한 구독' },
  {
    value: 'PREMIUM_YEARLY',
    label: '프리미엄 연간 (PREMIUM_YEARLY)',
    description: '무제한 백테스트, 무제한 구독 (연간)',
  },
];

export function UserTierModal({ userId, currentTier, userLoginId, onClose, onSuccess }: Props) {
  const [selectedTier, setSelectedTier] = useState<Tier>(currentTier);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (selectedTier === currentTier) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateUserTier(userId, { tier: selectedTier });
      onSuccess(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '티어 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = TIER_OPTIONS.find((o) => o.value === selectedTier);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>유저 티어 변경</DialogTitle>
          <DialogDescription>
            <span className="font-medium">{userLoginId}</span>의 구독 티어를 변경합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <label className="text-sm font-medium mb-2 block">티어 선택</label>
          <Select value={selectedTier} onValueChange={(v) => setSelectedTier(v as Tier)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedOption && (
            <p className="text-xs text-muted-foreground mt-2">{selectedOption.description}</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
