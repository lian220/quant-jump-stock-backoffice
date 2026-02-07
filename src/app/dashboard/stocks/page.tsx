'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, RefreshCw, Loader2, X } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import {
  getStocks,
  createStock,
  updateStock,
  deleteStock,
  changeDesignation,
  marketLabels,
  designationLabels,
  marketOptions,
  designationOptions,
} from '@/lib/api/stocks';
import type {
  StockSummary,
  Market,
  DesignationStatus,
  CreateStockRequest,
  UpdateStockRequest,
} from '@/lib/api/stocks';

// 지정상태별 추가 스타일
const designationBadgeStyle: Record<DesignationStatus, string> = {
  NORMAL: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CAUTION: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  WARNING: 'bg-orange-100 text-orange-700 border-orange-200',
  DANGER: 'bg-red-100 text-red-700 border-red-200',
  DELISTED: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // 필터
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const [marketFilter, setMarketFilter] = useState<string>('all');

  // 페이지네이션
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 모달
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStock, setEditingStock] = useState<StockSummary | null>(null);
  const [designationStock, setDesignationStock] = useState<StockSummary | null>(null);

  // 폼
  const [formData, setFormData] = useState<CreateStockRequest>({
    ticker: '',
    stockName: '',
    market: 'KR',
  });
  const [designationForm, setDesignationForm] = useState<{
    status: DesignationStatus;
    reason: string;
  }>({
    status: 'NORMAL',
    reason: '',
  });

  // 검색어 디바운스 (300ms)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(0);
    }, 300);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const loadStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getStocks({
        query: debouncedQuery || undefined,
        market: marketFilter !== 'all' ? (marketFilter as Market) : undefined,
        page,
        size: 20,
      });

      setStocks(response.stocks);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error('종목 목록 로딩 실패:', err);
      setError('종목 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, marketFilter, page]);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const handleCreate = async () => {
    try {
      setActionLoading(-1);
      await createStock(formData);
      alert('종목이 등록되었습니다.');
      setShowCreateModal(false);
      setFormData({ ticker: '', stockName: '', market: 'KR' });
      loadStocks();
    } catch (err) {
      console.error('종목 등록 실패:', err);
      alert('종목 등록에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdate = async () => {
    if (!editingStock) return;
    try {
      setActionLoading(editingStock.id);
      const req: UpdateStockRequest = {
        stockName: formData.stockName || undefined,
        stockNameEn: formData.stockNameEn || undefined,
        exchange: formData.exchange || undefined,
        sector: formData.sector || undefined,
        industry: formData.industry || undefined,
        market: formData.market || undefined,
        isEtf: formData.isEtf,
      };
      await updateStock(editingStock.id, req);
      alert('종목이 수정되었습니다.');
      setEditingStock(null);
      loadStocks();
    } catch (err) {
      console.error('종목 수정 실패:', err);
      alert('종목 수정에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (stock: StockSummary) => {
    if (!confirm(`"${stock.stockName} (${stock.ticker})" 종목을 삭제하시겠습니까?`)) return;
    try {
      setActionLoading(stock.id);
      await deleteStock(stock.id);
      alert('종목이 삭제되었습니다.');
      loadStocks();
    } catch (err) {
      console.error('종목 삭제 실패:', err);
      alert('종목 삭제에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeDesignation = async () => {
    if (!designationStock) return;
    try {
      setActionLoading(designationStock.id);
      await changeDesignation(designationStock.id, {
        designationStatus: designationForm.status,
        reason: designationForm.reason || undefined,
      });
      alert('지정 상태가 변경되었습니다.');
      setDesignationStock(null);
      loadStocks();
    } catch (err) {
      console.error('지정 상태 변경 실패:', err);
      alert('지정 상태 변경에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (stock: StockSummary) => {
    setEditingStock(stock);
    setFormData({
      ticker: stock.ticker,
      stockName: stock.stockName,
      stockNameEn: stock.stockNameEn || '',
      market: stock.market,
      sector: stock.sector || '',
      isEtf: stock.isEtf,
    });
  };

  const openDesignationModal = (stock: StockSummary) => {
    setDesignationStock(stock);
    setDesignationForm({
      status: stock.designationStatus,
      reason: '',
    });
  };

  // 로딩 상태
  if (loading && stocks.length === 0) {
    return (
      <>
        <Header title="종목 관리" />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </>
    );
  }

  // 에러 상태
  if (error && stocks.length === 0) {
    return (
      <>
        <Header title="종목 관리" />
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={loadStocks} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="종목 관리" />

      <div className="p-6">
        {/* 통계 카드 */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">전체 종목</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalElements}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                한국 시장 (현재 페이지)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stocks.filter((s) => s.market === 'KR').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                미국 시장 (현재 페이지)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stocks.filter((s) => s.market === 'US').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ETF (현재 페이지)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-600">
                {stocks.filter((s) => s.isEtf).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 종목 목록 카드 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>종목 목록</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadStocks} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowCreateModal(true);
                  setFormData({ ticker: '', stockName: '', market: 'KR' });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                종목 등록
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 검색 및 필터 */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="종목 코드 또는 이름으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={marketFilter}
                onValueChange={(v) => {
                  setMarketFilter(v);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="시장" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 시장</SelectItem>
                  {marketOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 테이블 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>티커</TableHead>
                    <TableHead>종목명</TableHead>
                    <TableHead>시장</TableHead>
                    <TableHead>섹터</TableHead>
                    <TableHead>지정상태</TableHead>
                    <TableHead>ETF</TableHead>
                    <TableHead>활성</TableHead>
                    <TableHead className="w-32">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        {loading ? '로딩 중...' : '종목이 없습니다.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    stocks.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-mono font-medium text-emerald-600">
                          {stock.ticker}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{stock.stockName}</div>
                            {stock.stockNameEn && (
                              <div className="text-sm text-muted-foreground">
                                {stock.stockNameEn}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{marketLabels[stock.market]}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {stock.sector || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={designationBadgeStyle[stock.designationStatus]}>
                            {designationLabels[stock.designationStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {stock.isEtf ? <Badge variant="secondary">ETF</Badge> : '-'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block h-2.5 w-2.5 rounded-full ${
                              stock.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="수정"
                              onClick={() => openEditModal(stock)}
                              disabled={actionLoading === stock.id}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="지정상태 변경"
                              className="text-yellow-600 hover:text-yellow-700"
                              onClick={() => openDesignationModal(stock)}
                              disabled={actionLoading === stock.id}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="삭제"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(stock)}
                              disabled={actionLoading === stock.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 페이지네이션 */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {totalElements === 0
                  ? '0개'
                  : `${page * 20 + 1}-${Math.min((page + 1) * 20, totalElements)} / 총 ${totalElements}개`}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0 || loading}
                >
                  이전
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1 || loading}
                >
                  다음
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 종목 등록/수정 모달 */}
      {(showCreateModal || editingStock) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingStock ? '종목 수정' : '종목 등록'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingStock(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5">종목 코드 *</Label>
                  <Input
                    value={formData.ticker}
                    onChange={(e) =>
                      setFormData({ ...formData, ticker: e.target.value.toUpperCase() })
                    }
                    disabled={!!editingStock}
                    placeholder="예: AAPL"
                  />
                </div>
                <div>
                  <Label className="mb-1.5">시장 *</Label>
                  <Select
                    value={formData.market}
                    onValueChange={(v) => setFormData({ ...formData, market: v as Market })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {marketOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-1.5">종목명 *</Label>
                <Input
                  value={formData.stockName}
                  onChange={(e) => setFormData({ ...formData, stockName: e.target.value })}
                  placeholder="예: 애플"
                />
              </div>

              <div>
                <Label className="mb-1.5">영문 종목명</Label>
                <Input
                  value={formData.stockNameEn || ''}
                  onChange={(e) => setFormData({ ...formData, stockNameEn: e.target.value })}
                  placeholder="예: Apple Inc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5">거래소</Label>
                  <Input
                    value={formData.exchange || ''}
                    onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
                    placeholder="예: NASDAQ"
                  />
                </div>
                <div>
                  <Label className="mb-1.5">섹터</Label>
                  <Input
                    value={formData.sector || ''}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    placeholder="예: Technology"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5">산업</Label>
                  <Input
                    value={formData.industry || ''}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="예: Consumer Electronics"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 pb-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.isEtf || false}
                      onChange={(e) => setFormData({ ...formData, isEtf: e.target.checked })}
                      className="rounded border-slate-300"
                    />
                    ETF 여부
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingStock(null);
                }}
              >
                취소
              </Button>
              <Button
                onClick={editingStock ? handleUpdate : handleCreate}
                disabled={actionLoading !== null}
              >
                {actionLoading !== null && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingStock ? '수정' : '등록'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 지정상태 변경 모달 */}
      {designationStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">지정 상태 변경</h2>
              <button
                onClick={() => setDesignationStock(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-4 text-sm text-slate-500">
              <span className="font-medium text-slate-900">{designationStock.stockName}</span> (
              {designationStock.ticker})의 지정 상태를 변경합니다.
            </p>

            <div className="space-y-4">
              <div>
                <Label className="mb-1.5">지정 상태</Label>
                <Select
                  value={designationForm.status}
                  onValueChange={(v) =>
                    setDesignationForm({
                      ...designationForm,
                      status: v as DesignationStatus,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {designationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5">사유</Label>
                <textarea
                  value={designationForm.reason}
                  onChange={(e) =>
                    setDesignationForm({
                      ...designationForm,
                      reason: e.target.value,
                    })
                  }
                  placeholder="지정 사유를 입력하세요..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDesignationStock(null)}>
                취소
              </Button>
              <Button
                onClick={handleChangeDesignation}
                disabled={
                  actionLoading !== null ||
                  designationForm.status === designationStock.designationStatus
                }
                className="bg-yellow-500 text-white hover:bg-yellow-600"
              >
                {actionLoading !== null && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                변경
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
