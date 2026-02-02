'use client';

import React, { useState } from 'react';
import { Search, MoreHorizontal, UserPlus, Filter, Mail, Shield, Ban } from 'lucide-react';
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

interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'banned';
  role: 'user' | 'admin';
  plan: 'free' | 'basic' | 'premium';
  createdAt: string;
  lastLogin: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: '관리자',
    status: 'active',
    role: 'admin',
    plan: 'premium',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-20',
  },
  {
    id: '2',
    email: 'user1@example.com',
    name: '김철수',
    status: 'active',
    role: 'user',
    plan: 'basic',
    createdAt: '2024-01-05',
    lastLogin: '2024-01-19',
  },
  {
    id: '3',
    email: 'user2@example.com',
    name: '이영희',
    status: 'active',
    role: 'user',
    plan: 'premium',
    createdAt: '2024-01-08',
    lastLogin: '2024-01-18',
  },
  {
    id: '4',
    email: 'user3@example.com',
    name: '박민수',
    status: 'inactive',
    role: 'user',
    plan: 'free',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-10',
  },
  {
    id: '5',
    email: 'user4@example.com',
    name: '최지은',
    status: 'banned',
    role: 'user',
    plan: 'basic',
    createdAt: '2024-01-12',
    lastLogin: '2024-01-15',
  },
  {
    id: '6',
    email: 'user5@example.com',
    name: '정수민',
    status: 'active',
    role: 'user',
    plan: 'premium',
    createdAt: '2024-01-14',
    lastLogin: '2024-01-20',
  },
  {
    id: '7',
    email: 'user6@example.com',
    name: '강민호',
    status: 'active',
    role: 'user',
    plan: 'free',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-19',
  },
  {
    id: '8',
    email: 'user7@example.com',
    name: '윤서연',
    status: 'inactive',
    role: 'user',
    plan: 'basic',
    createdAt: '2024-01-16',
    lastLogin: '2024-01-16',
  },
];

const statusConfig = {
  active: { label: '활성', variant: 'default' as const, color: 'bg-green-500' },
  inactive: { label: '비활성', variant: 'secondary' as const, color: 'bg-gray-500' },
  banned: { label: '정지', variant: 'destructive' as const, color: 'bg-red-500' },
};

const planConfig = {
  free: { label: 'Free', variant: 'outline' as const },
  basic: { label: 'Basic', variant: 'secondary' as const },
  premium: { label: 'Premium', variant: 'default' as const },
};

const roleConfig = {
  user: { label: '사용자', icon: null },
  admin: { label: '관리자', icon: Shield },
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === 'active').length,
    inactive: mockUsers.filter((u) => u.status === 'inactive').length,
    banned: mockUsers.filter((u) => u.status === 'banned').length,
  };

  return (
    <>
      <Header title="사용자 관리" />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                전체 사용자
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                활성 사용자
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                비활성 사용자
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                정지 사용자
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.banned}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>사용자 목록</CardTitle>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                사용자 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="이름 또는 이메일로 검색..."
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
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="inactive">비활성</SelectItem>
                    <SelectItem value="banned">정지</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="플랜" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 플랜</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사용자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>플랜</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>최근 로그인</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[user.status].variant}>
                          {statusConfig[user.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {roleConfig[user.role].icon && (
                            <Shield className="h-3 w-3 text-primary" />
                          )}
                          <span className="text-sm">{roleConfig[user.role].label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={planConfig[user.plan].variant}>
                          {planConfig[user.plan].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.createdAt}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" title="이메일 보내기">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="정지">
                            <Ban className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">총 {filteredUsers.length}명의 사용자</p>
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
