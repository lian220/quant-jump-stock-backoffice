'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  toggleCategory,
  deleteCategory,
  getGroupLabel,
} from '@/lib/api/news-categories';
import type {
  AdminCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/lib/api/news-categories';

const ICON_OPTIONS = [
  { value: 'zap', label: '⚡ zap' },
  { value: 'bar-chart-2', label: '📊 bar-chart-2' },
  { value: 'landmark', label: '🏛️ landmark' },
  { value: 'trending-up', label: '📈 trending-up' },
  { value: 'search', label: '🔍 search' },
  { value: 'shield', label: '🛡️ shield' },
  { value: 'git-merge', label: '🤝 git-merge' },
  { value: 'layers', label: '📋 layers' },
  { value: 'gift', label: '🎁 gift' },
  { value: 'flame', label: '🔥 flame' },
  { value: 'bitcoin', label: '₿ bitcoin' },
  { value: 'pie-chart', label: '🥧 pie-chart' },
  { value: 'globe', label: '🌍 globe' },
  { value: 'target', label: '🎯 target' },
  { value: 'calendar', label: '📅 calendar' },
];

const GROUP_OPTIONS = [
  { value: 'MARKET', label: '시장' },
  { value: 'COMPANY', label: '기업' },
  { value: 'MACRO', label: '매크로' },
  { value: 'ASSET', label: '자산' },
  { value: 'INFO', label: '정보' },
];

type FormMode = 'closed' | 'create' | 'edit';

export default function NewsCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');

  // 폼
  const [formMode, setFormMode] = useState<FormMode>('closed');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    nameEn: '',
    group: 'MARKET',
    description: '',
    icon: '',
    weight: 0.1,
    sortOrder: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAdminCategories(true);
      setCategories(res.categories ?? []);
    } catch (err) {
      console.error('카테고리 로드 실패:', err);
      setError('카테고리를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 필터링
  const filteredCategories = categories.filter((cat) => {
    if (filterGroup !== 'all' && cat.group !== filterGroup) return false;
    if (filterActive === 'active' && !cat.isActive) return false;
    if (filterActive === 'inactive' && cat.isActive) return false;
    return true;
  });

  // 폼 초기화
  const resetForm = () => {
    setFormMode('closed');
    setEditingId(null);
    setFormData({
      name: '',
      nameEn: '',
      group: 'MARKET',
      description: '',
      icon: '',
      weight: 0.1,
      sortOrder: 0,
    });
  };

  // 수정 모드 진입
  const handleEdit = (cat: AdminCategory) => {
    setFormMode('edit');
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      nameEn: cat.nameEn,
      group: cat.group,
      description: cat.description ?? '',
      icon: cat.icon ?? '',
      weight: cat.weight,
      sortOrder: cat.sortOrder,
    });
  };

  // 저장
  const handleSave = async () => {
    if (!formData.name || !formData.nameEn) {
      alert('카테고리명(한/영)은 필수입니다.');
      return;
    }
    setIsSaving(true);
    try {
      if (formMode === 'create') {
        await createCategory(formData);
      } else if (formMode === 'edit' && editingId) {
        const updateData: UpdateCategoryRequest = {
          name: formData.name,
          nameEn: formData.nameEn,
          group: formData.group,
          description: formData.description || undefined,
          icon: formData.icon || undefined,
          weight: formData.weight,
          sortOrder: formData.sortOrder,
        };
        await updateCategory(editingId, updateData);
      }
      resetForm();
      await fetchCategories();
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 토글
  const handleToggle = async (id: number) => {
    try {
      await toggleCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error('토글 실패:', err);
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 삭제
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return;
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.filter((c) => !c.isActive).length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white">뉴스 카테고리 관리</h1>
        <p className="mt-1 text-slate-400">뉴스 카테고리를 관리하고 노출/미노출을 설정합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-slate-400">전체</p>
            <p className="text-2xl font-bold text-white">{categories.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-slate-400">노출 중</p>
            <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-slate-400">미노출</p>
            <p className="text-2xl font-bold text-red-400">{inactiveCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 + 생성 버튼 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <Select value={filterGroup} onValueChange={setFilterGroup}>
              <SelectTrigger className="w-32 bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="그룹" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-slate-200">
                  전체 그룹
                </SelectItem>
                {GROUP_OPTIONS.map((g) => (
                  <SelectItem key={g.value} value={g.value} className="text-slate-200">
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-32 bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-slate-200">
                  전체 상태
                </SelectItem>
                <SelectItem value="active" className="text-slate-200">
                  노출
                </SelectItem>
                <SelectItem value="inactive" className="text-slate-200">
                  미노출
                </SelectItem>
              </SelectContent>
            </Select>

            <span className="flex-1" />
            <span className="text-sm text-slate-400">{filteredCategories.length}개</span>

            <Button
              onClick={() => {
                resetForm();
                setFormMode('create');
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              + 카테고리 추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 생성/수정 폼 */}
      {formMode !== 'closed' && (
        <Card className="bg-slate-800/50 border-emerald-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white">
              {formMode === 'create' ? '카테고리 추가' : '카테고리 수정'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {formMode === 'create'
                ? '새 뉴스 카테고리를 추가합니다.'
                : `ID: ${editingId} 카테고리를 수정합니다.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">카테고리명 (한글) *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="속보"
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">카테고리명 (영문) *</label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Breaking News"
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">그룹</label>
                <Select
                  value={formData.group}
                  onValueChange={(v) => setFormData({ ...formData, group: v })}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {GROUP_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value} className="text-slate-200">
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">아이콘</label>
                <Select
                  value={formData.icon || 'none'}
                  onValueChange={(v) => setFormData({ ...formData, icon: v === 'none' ? '' : v })}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="none" className="text-slate-200">
                      없음
                    </SelectItem>
                    {ICON_OPTIONS.map((i) => (
                      <SelectItem key={i.value} value={i.value} className="text-slate-200">
                        {i.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">가중치</label>
                <Input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">설명</label>
                <Input
                  value={formData.description ?? ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="카테고리 설명"
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">정렬 순서</label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                  }
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSaving ? '저장 중...' : formMode === 'create' ? '추가' : '수정'}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="border-slate-600 text-slate-300"
              >
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 테이블 */}
      {error ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <p className="text-red-400">{error}</p>
            <Button
              onClick={fetchCategories}
              variant="outline"
              className="mt-4 border-slate-600 text-slate-300"
            >
              다시 시도
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-400">ID</TableHead>
                <TableHead className="text-slate-400">카테고리</TableHead>
                <TableHead className="text-slate-400">영문</TableHead>
                <TableHead className="text-slate-400">그룹</TableHead>
                <TableHead className="text-slate-400">아이콘</TableHead>
                <TableHead className="text-slate-400">가중치</TableHead>
                <TableHead className="text-slate-400">순서</TableHead>
                <TableHead className="text-slate-400">상태</TableHead>
                <TableHead className="text-slate-400 text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                    카테고리가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((cat) => (
                  <TableRow key={cat.id} className="border-slate-700/50">
                    <TableCell className="text-slate-500 font-mono text-xs">{cat.id}</TableCell>
                    <TableCell className="text-white font-medium">{cat.name}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{cat.nameEn}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs">
                        {getGroupLabel(cat.group)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-lg">{cat.icon ?? '-'}</TableCell>
                    <TableCell className="text-slate-300 font-mono text-sm">
                      {cat.weight.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">{cat.sortOrder}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          cat.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {cat.isActive ? '노출' : '미노출'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(cat.id)}
                          className={
                            cat.isActive
                              ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                              : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                          }
                        >
                          {cat.isActive ? '숨김' : '노출'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(cat)}
                          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                        >
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          삭제
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
