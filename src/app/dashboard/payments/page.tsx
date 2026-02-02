'use client';

import React, { useState } from 'react';
import {
  Search,
  Download,
  Filter,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RotateCcw,
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

interface Payment {
  id: string;
  orderId: string;
  userEmail: string;
  userName: string;
  plan: 'basic' | 'premium' | 'enterprise';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  method: 'card' | 'transfer' | 'kakao' | 'naver';
  createdAt: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    orderId: 'ORD-2024-001',
    userEmail: 'user1@example.com',
    userName: '김철수',
    plan: 'premium',
    amount: 99000,
    status: 'completed',
    method: 'card',
    createdAt: '2024-01-20 14:30',
  },
  {
    id: '2',
    orderId: 'ORD-2024-002',
    userEmail: 'user2@example.com',
    userName: '이영희',
    plan: 'basic',
    amount: 29000,
    status: 'completed',
    method: 'kakao',
    createdAt: '2024-01-20 13:15',
  },
  {
    id: '3',
    orderId: 'ORD-2024-003',
    userEmail: 'user3@example.com',
    userName: '박민수',
    plan: 'premium',
    amount: 99000,
    status: 'pending',
    method: 'transfer',
    createdAt: '2024-01-20 12:00',
  },
  {
    id: '4',
    orderId: 'ORD-2024-004',
    userEmail: 'user4@example.com',
    userName: '최지은',
    plan: 'enterprise',
    amount: 299000,
    status: 'completed',
    method: 'card',
    createdAt: '2024-01-19 18:45',
  },
  {
    id: '5',
    orderId: 'ORD-2024-005',
    userEmail: 'user5@example.com',
    userName: '정수민',
    plan: 'basic',
    amount: 29000,
    status: 'failed',
    method: 'naver',
    createdAt: '2024-01-19 16:20',
  },
  {
    id: '6',
    orderId: 'ORD-2024-006',
    userEmail: 'user6@example.com',
    userName: '강민호',
    plan: 'premium',
    amount: 99000,
    status: 'refunded',
    method: 'card',
    createdAt: '2024-01-19 14:00',
  },
  {
    id: '7',
    orderId: 'ORD-2024-007',
    userEmail: 'user7@example.com',
    userName: '윤서연',
    plan: 'basic',
    amount: 29000,
    status: 'completed',
    method: 'kakao',
    createdAt: '2024-01-18 11:30',
  },
  {
    id: '8',
    orderId: 'ORD-2024-008',
    userEmail: 'user8@example.com',
    userName: '임재현',
    plan: 'enterprise',
    amount: 299000,
    status: 'completed',
    method: 'transfer',
    createdAt: '2024-01-18 09:15',
  },
];

const statusConfig = {
  completed: {
    label: '완료',
    variant: 'default' as const,
    icon: CheckCircle,
    color: 'text-green-500',
  },
  pending: { label: '대기', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-500' },
  failed: { label: '실패', variant: 'destructive' as const, icon: XCircle, color: 'text-red-500' },
  refunded: { label: '환불', variant: 'outline' as const, icon: RotateCcw, color: 'text-gray-500' },
};

const planConfig = {
  basic: { label: 'Basic', price: '₩29,000/월' },
  premium: { label: 'Premium', price: '₩99,000/월' },
  enterprise: { label: 'Enterprise', price: '₩299,000/월' },
};

const methodConfig = {
  card: { label: '신용카드' },
  transfer: { label: '계좌이체' },
  kakao: { label: '카카오페이' },
  naver: { label: '네이버페이' },
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesPlan = planFilter === 'all' || payment.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    totalRevenue: mockPayments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    totalPayments: mockPayments.length,
    completed: mockPayments.filter((p) => p.status === 'completed').length,
    pending: mockPayments.filter((p) => p.status === 'pending').length,
    failed: mockPayments.filter((p) => p.status === 'failed').length,
  };

  return (
    <>
      <Header title="결제 내역" />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 매출</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">완료된 결제 기준</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">전체 결제</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPayments}</div>
              <p className="text-xs text-muted-foreground">이번 달</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">성공률</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((stats.completed / stats.totalPayments) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">{stats.completed}건 완료</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">대기/실패</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending + stats.failed}</div>
              <p className="text-xs text-muted-foreground">
                대기 {stats.pending}건 / 실패 {stats.failed}건
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>결제 목록</CardTitle>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                내보내기
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="주문번호, 이름, 이메일로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="pending">대기</SelectItem>
                    <SelectItem value="failed">실패</SelectItem>
                    <SelectItem value="refunded">환불</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="플랜" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 플랜</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>사용자</TableHead>
                    <TableHead>플랜</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>결제수단</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>일시</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const StatusIcon = statusConfig[payment.status].icon;
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.userName}</div>
                            <div className="text-sm text-muted-foreground">{payment.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{planConfig[payment.plan].label}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₩{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {methodConfig[payment.method].label}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <StatusIcon
                              className={`h-4 w-4 ${statusConfig[payment.status].color}`}
                            />
                            <Badge variant={statusConfig[payment.status].variant}>
                              {statusConfig[payment.status].label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payment.createdAt}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" title="상세보기">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">총 {filteredPayments.length}건의 결제</p>
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
    </>
  );
}
