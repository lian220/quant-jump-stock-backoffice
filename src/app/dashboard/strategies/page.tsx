'use client';

import React, { useState } from 'react';
import {
  Search,
  MoreHorizontal,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Send,
  TrendingUp,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';
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

// 전략 상태 타입
type StrategyStatus = 'draft' | 'pending' | 'approved' | 'published' | 'rejected';

// 전략 유형 타입
type StrategyType = 'momentum' | 'value' | 'growth' | 'dividend' | 'mixed';

// 전략 인터페이스
interface Strategy {
  id: string;
  name: string;
  description: string;
  author: string;
  authorEmail: string;
  status: StrategyStatus;
  type: StrategyType;
  returnRate: number; // 예상 수익률 (%)
  riskLevel: 'low' | 'medium' | 'high';
  subscribers: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Mock 데이터
const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: '모멘텀 추세 추종',
    description: '52주 신고가 돌파 종목 중 거래량 급증 종목 매수',
    author: '김퀀트',
    authorEmail: 'kim.quant@example.com',
    status: 'published',
    type: 'momentum',
    returnRate: 15.5,
    riskLevel: 'high',
    subscribers: 128,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-18',
    publishedAt: '2024-01-10',
  },
  {
    id: '2',
    name: '가치주 저PER 전략',
    description: 'PER 10 이하, ROE 15% 이상 우량 가치주 포트폴리오',
    author: '이분석',
    authorEmail: 'lee.analyst@example.com',
    status: 'pending',
    type: 'value',
    returnRate: 12.3,
    riskLevel: 'low',
    subscribers: 0,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19',
    publishedAt: null,
  },
  {
    id: '3',
    name: '배당 성장주 포트폴리오',
    description: '5년 연속 배당 증가 기업 중 배당수익률 상위 종목',
    author: '박배당',
    authorEmail: 'park.dividend@example.com',
    status: 'approved',
    type: 'dividend',
    returnRate: 8.7,
    riskLevel: 'low',
    subscribers: 0,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-17',
    publishedAt: null,
  },
  {
    id: '4',
    name: '성장주 GARP 전략',
    description: 'PEG 1 이하 성장주 중 실적 성장률 상위 종목 선별',
    author: '최성장',
    authorEmail: 'choi.growth@example.com',
    status: 'draft',
    type: 'growth',
    returnRate: 18.2,
    riskLevel: 'medium',
    subscribers: 0,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    publishedAt: null,
  },
  {
    id: '5',
    name: '복합 팩터 전략',
    description: '모멘텀 + 가치 + 퀄리티 팩터 조합 멀티팩터 전략',
    author: '김퀀트',
    authorEmail: 'kim.quant@example.com',
    status: 'rejected',
    type: 'mixed',
    returnRate: 14.1,
    riskLevel: 'medium',
    subscribers: 0,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-16',
    publishedAt: null,
  },
  {
    id: '6',
    name: '소형주 모멘텀',
    description: '시가총액 하위 20% 종목 중 3개월 수익률 상위 종목',
    author: '정소형',
    authorEmail: 'jung.small@example.com',
    status: 'published',
    type: 'momentum',
    returnRate: 22.5,
    riskLevel: 'high',
    subscribers: 87,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-14',
    publishedAt: '2024-01-07',
  },
  {
    id: '7',
    name: '고배당 리츠 전략',
    description: '배당수익률 5% 이상 리츠 및 인프라 펀드 투자',
    author: '박배당',
    authorEmail: 'park.dividend@example.com',
    status: 'pending',
    type: 'dividend',
    returnRate: 6.8,
    riskLevel: 'low',
    subscribers: 0,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20',
    publishedAt: null,
  },
  {
    id: '8',
    name: '실적 서프라이즈 전략',
    description: '어닝 서프라이즈 발생 종목 중 상향 조정 종목 매수',
    author: '이분석',
    authorEmail: 'lee.analyst@example.com',
    status: 'draft',
    type: 'growth',
    returnRate: 16.9,
    riskLevel: 'medium',
    subscribers: 0,
    createdAt: '2024-01-19',
    updatedAt: '2024-01-20',
    publishedAt: null,
  },
];

// 상태별 설정
const statusConfig: Record<
  StrategyStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: React.ElementType;
  }
> = {
  draft: { label: '초안', variant: 'outline', icon: FileText },
  pending: { label: '검토 대기', variant: 'secondary', icon: Clock },
  approved: { label: '승인됨', variant: 'default', icon: CheckCircle },
  published: { label: '발행됨', variant: 'default', icon: Send },
  rejected: { label: '반려됨', variant: 'destructive', icon: XCircle },
};

// 전략 유형별 설정
const typeConfig: Record<StrategyType, { label: string; color: string }> = {
  momentum: { label: '모멘텀', color: 'text-blue-500' },
  value: { label: '가치', color: 'text-green-500' },
  growth: { label: '성장', color: 'text-purple-500' },
  dividend: { label: '배당', color: 'text-orange-500' },
  mixed: { label: '복합', color: 'text-cyan-500' },
};

// 리스크 레벨 설정
const riskConfig: Record<'low' | 'medium' | 'high', { label: string; color: string }> = {
  low: { label: '낮음', color: 'text-green-500' },
  medium: { label: '중간', color: 'text-yellow-500' },
  high: { label: '높음', color: 'text-red-500' },
};

export default function StrategiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  // 필터링된 전략 목록
  const filteredStrategies = mockStrategies.filter((strategy) => {
    const matchesSearch =
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || strategy.status === statusFilter;
    const matchesType = typeFilter === 'all' || strategy.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // 통계
  const stats = {
    total: mockStrategies.length,
    pending: mockStrategies.filter((s) => s.status === 'pending').length,
    published: mockStrategies.filter((s) => s.status === 'published').length,
    totalSubscribers: mockStrategies.reduce((sum, s) => sum + s.subscribers, 0),
  };

  // 승인 처리
  const handleApprove = (strategy: Strategy) => {
    console.log('승인:', strategy.id, strategy.name);
    // TODO: API 연동
    alert(`"${strategy.name}" 전략이 승인되었습니다.`);
  };

  // 반려 처리
  const handleReject = (strategy: Strategy) => {
    console.log('반려:', strategy.id, strategy.name);
    // TODO: API 연동
    alert(`"${strategy.name}" 전략이 반려되었습니다.`);
  };

  // 발행 처리
  const handlePublish = (strategy: Strategy) => {
    console.log('발행:', strategy.id, strategy.name);
    // TODO: API 연동
    alert(`"${strategy.name}" 전략이 발행되었습니다.`);
  };

  // 상세 보기
  const handleViewDetail = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  // 상세 모달 닫기
  const closeDetail = () => {
    setSelectedStrategy(null);
  };

  return (
    <>
      <Header title="전략 관리" />

      <div className="p-6">
        {/* 통계 카드 */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">전체 전략</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">검토 대기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                {stats.pending > 0 && <AlertCircle className="h-5 w-5 text-yellow-500" />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">발행 중</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 구독자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-emerald-600">{stats.totalSubscribers}</div>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 전략 목록 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>전략 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 검색 및 필터 */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="전략명, 작성자, 설명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="draft">초안</SelectItem>
                    <SelectItem value="pending">검토 대기</SelectItem>
                    <SelectItem value="approved">승인됨</SelectItem>
                    <SelectItem value="published">발행됨</SelectItem>
                    <SelectItem value="rejected">반려됨</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 유형</SelectItem>
                    <SelectItem value="momentum">모멘텀</SelectItem>
                    <SelectItem value="value">가치</SelectItem>
                    <SelectItem value="growth">성장</SelectItem>
                    <SelectItem value="dividend">배당</SelectItem>
                    <SelectItem value="mixed">복합</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 테이블 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>전략명</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead className="text-right">예상 수익률</TableHead>
                    <TableHead>리스크</TableHead>
                    <TableHead className="text-right">구독자</TableHead>
                    <TableHead>수정일</TableHead>
                    <TableHead className="w-32">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStrategies.map((strategy) => {
                    const StatusIcon = statusConfig[strategy.status].icon;
                    return (
                      <TableRow key={strategy.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{strategy.name}</div>
                            <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                              {strategy.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${typeConfig[strategy.type].color}`}>
                            {typeConfig[strategy.type].label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[strategy.status].variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[strategy.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{strategy.author}</div>
                            <div className="text-xs text-muted-foreground">
                              {strategy.authorEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={strategy.returnRate >= 0 ? 'text-green-500' : 'text-red-500'}
                          >
                            {strategy.returnRate >= 0 ? '+' : ''}
                            {strategy.returnRate}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={riskConfig[strategy.riskLevel].color}>
                            {riskConfig[strategy.riskLevel].label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{strategy.subscribers}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {strategy.updatedAt}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {/* 상세 보기 */}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="상세 보기"
                              onClick={() => handleViewDetail(strategy)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {/* 검토 대기 상태: 승인/반려 버튼 */}
                            {strategy.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="승인"
                                  className="text-green-500 hover:text-green-600"
                                  onClick={() => handleApprove(strategy)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="반려"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => handleReject(strategy)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}

                            {/* 승인됨 상태: 발행 버튼 */}
                            {strategy.status === 'approved' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="발행"
                                className="text-blue-500 hover:text-blue-600"
                                onClick={() => handlePublish(strategy)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}

                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* 페이지네이션 */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                총 {filteredStrategies.length}개의 전략
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  이전
                </Button>
                <Button variant="outline" size="sm">
                  다음
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 보기 모달 */}
      {selectedStrategy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-2xl rounded-xl bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedStrategy.name}</h2>
                <p className="text-sm text-slate-400">
                  {typeConfig[selectedStrategy.type].label} 전략 • {selectedStrategy.author}
                </p>
              </div>
              <Badge variant={statusConfig[selectedStrategy.status].variant}>
                {statusConfig[selectedStrategy.status].label}
              </Badge>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-slate-400">설명</h3>
                <p className="text-white">{selectedStrategy.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-400">예상 수익률</h3>
                  <p
                    className={`text-lg font-bold ${selectedStrategy.returnRate >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {selectedStrategy.returnRate >= 0 ? '+' : ''}
                    {selectedStrategy.returnRate}%
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-400">리스크 수준</h3>
                  <p
                    className={`text-lg font-bold ${riskConfig[selectedStrategy.riskLevel].color}`}
                  >
                    {riskConfig[selectedStrategy.riskLevel].label}
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-400">구독자 수</h3>
                  <p className="text-lg font-bold text-white">{selectedStrategy.subscribers}명</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-400">작성자 이메일</h3>
                  <p className="text-white">{selectedStrategy.authorEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-400">생성일</h3>
                  <p className="text-white">{selectedStrategy.createdAt}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-400">수정일</h3>
                  <p className="text-white">{selectedStrategy.updatedAt}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-400">발행일</h3>
                  <p className="text-white">{selectedStrategy.publishedAt || '-'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {selectedStrategy.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => {
                      handleReject(selectedStrategy);
                      closeDetail();
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    반려
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(selectedStrategy);
                      closeDetail();
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    승인
                  </Button>
                </>
              )}
              {selectedStrategy.status === 'approved' && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    handlePublish(selectedStrategy);
                    closeDetail();
                  }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  발행하기
                </Button>
              )}
              <Button variant="outline" onClick={closeDetail}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
