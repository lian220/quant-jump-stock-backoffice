'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus, Loader2 } from 'lucide-react';
import { Header } from '@/components/dashboard';
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
  GROUP_LABELS,
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

const GROUP_OPTIONS = Object.entries(GROUP_LABELS).map(([value, label]) => ({
  value,
  label,
}));

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
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

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
      } else if (formMode === 'edit' && editingId !== null) {
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
    if (actionLoadingId !== null) return;
    setActionLoadingId(id);
    try {
      await toggleCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error('토글 실패:', err);
      alert('상태 변경에 실패했습니다.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // 삭제
  const handleDelete = async (id: number, name: string) => {
    if (actionLoadingId !== null) return;
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return;
    setActionLoadingId(id);
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.filter((c) => !c.isActive).length;

  // 로딩 상태
  if (isLoading && categories.length === 0) {
    return (
      <>
        <Header
          title="뉴스 카테고리 관리"
          description="뉴스 카테고리를 관리하고 노출/미노출을 설정합니다."
        />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </>
    );
  }

  // 에러 상태
  if (error && categories.length === 0) {
    return (
      <>
        <Header
          title="뉴스 카테고리 관리"
          description="뉴스 카테고리를 관리하고 노출/미노출을 설정합니다."
        />
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchCategories} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="뉴스 카테고리 관리"
        description="뉴스 카테고리를 관리하고 노출/미노출을 설정합니다."
      />

      <div className="p-6">
        {/* 통계 카드 */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                전체 카테고리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">노출 중</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">미노출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{inactiveCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* 생성/수정 폼 */}
        {formMode !== 'closed' && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>{formMode === 'create' ? '카테고리 추가' : '카테고리 수정'}</CardTitle>
              <CardDescription>
                {formMode === 'create'
                  ? '새 뉴스 카테고리를 추가합니다.'
                  : `ID: ${editingId} 카테고리를 수정합니다.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    카테고리명 (한글) *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="속보"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    카테고리명 (영문) *
                  </label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Breaking News"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">그룹</label>
                  <Select
                    value={formData.group}
                    onValueChange={(v) => setFormData({ ...formData, group: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GROUP_OPTIONS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">아이콘</label>
                  <Select
                    value={formData.icon || 'none'}
                    onValueChange={(v) => setFormData({ ...formData, icon: v === 'none' ? '' : v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">없음</SelectItem>
                      {ICON_OPTIONS.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">가중치</label>
                  <Input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">설명</label>
                  <Input
                    value={formData.description ?? ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="카테고리 설명"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">정렬 순서</label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                    }
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
                <Button variant="outline" onClick={resetForm}>
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 카테고리 목록 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>카테고리 목록</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchCategories} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  resetForm();
                  setFormMode('create');
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                카테고리 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 필터 */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="flex gap-2">
                <Select value={filterGroup} onValueChange={setFilterGroup}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="그룹" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 그룹</SelectItem>
                    {GROUP_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterActive} onValueChange={setFilterActive}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="active">노출</SelectItem>
                    <SelectItem value="inactive">미노출</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1" />
              <p className="text-sm text-muted-foreground self-center">
                총 {filteredCategories.length}개
              </p>
            </div>

            {/* 테이블 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>영문</TableHead>
                    <TableHead>그룹</TableHead>
                    <TableHead>아이콘</TableHead>
                    <TableHead>가중치</TableHead>
                    <TableHead>순서</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-32">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        로딩 중...
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        카테고리가 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {cat.id}
                        </TableCell>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {cat.nameEn}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{getGroupLabel(cat.group)}</Badge>
                        </TableCell>
                        <TableCell className="text-lg">{cat.icon ?? '-'}</TableCell>
                        <TableCell className="font-mono text-sm">{cat.weight.toFixed(2)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {cat.sortOrder}
                        </TableCell>
                        <TableCell>
                          <Badge variant={cat.isActive ? 'default' : 'destructive'}>
                            {cat.isActive ? '노출' : '미노출'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggle(cat.id)}
                              disabled={actionLoadingId === cat.id}
                              className={
                                cat.isActive
                                  ? 'text-yellow-500 hover:text-yellow-600'
                                  : 'text-green-500 hover:text-green-600'
                              }
                            >
                              {cat.isActive ? '숨김' : '노출'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}>
                              수정
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(cat.id, cat.name)}
                              disabled={actionLoadingId === cat.id}
                              className="text-red-500 hover:text-red-600"
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
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
