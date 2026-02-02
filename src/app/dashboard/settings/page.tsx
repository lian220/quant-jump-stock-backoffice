'use client';

import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Palette, Save, Key, Mail, Smartphone } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: '관리자',
    email: user?.email || '',
    phone: '010-1234-5678',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newUser: true,
    payment: true,
    report: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    loginAlert: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'system',
    language: 'ko',
    timezone: 'Asia/Seoul',
  });

  return (
    <>
      <Header title="설정" />

      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">프로필</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">알림</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">보안</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">테마</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>프로필 설정</CardTitle>
                <CardDescription>계정 정보를 관리합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {profileForm.name.charAt(0)}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      이미지 변경
                    </Button>
                    <p className="mt-1 text-sm text-muted-foreground">JPG, PNG 최대 2MB</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
                <CardDescription>알림 수신 방법을 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-4 text-sm font-medium">알림 채널</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">이메일 알림</p>
                          <p className="text-sm text-muted-foreground">이메일로 알림을 받습니다</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, email: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">푸시 알림</p>
                          <p className="text-sm text-muted-foreground">
                            브라우저 푸시 알림을 받습니다
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, push: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">SMS 알림</p>
                          <p className="text-sm text-muted-foreground">문자로 알림을 받습니다</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, sms: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-4 text-sm font-medium">알림 유형</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">신규 가입</p>
                        <p className="text-sm text-muted-foreground">새 사용자가 가입하면 알림</p>
                      </div>
                      <Switch
                        checked={notifications.newUser}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, newUser: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">결제 알림</p>
                        <p className="text-sm text-muted-foreground">결제 완료/실패 시 알림</p>
                      </div>
                      <Switch
                        checked={notifications.payment}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, payment: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">주간 리포트</p>
                        <p className="text-sm text-muted-foreground">매주 통계 리포트 수신</p>
                      </div>
                      <Switch
                        checked={notifications.report}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, report: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>보안 설정</CardTitle>
                <CardDescription>계정 보안을 관리합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">2단계 인증</p>
                        <p className="text-sm text-muted-foreground">
                          로그인 시 추가 인증을 요구합니다
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(checked) =>
                        setSecurity({ ...security, twoFactor: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">로그인 알림</p>
                        <p className="text-sm text-muted-foreground">새 기기에서 로그인 시 알림</p>
                      </div>
                    </div>
                    <Switch
                      checked={security.loginAlert}
                      onCheckedChange={(checked) =>
                        setSecurity({ ...security, loginAlert: checked })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>세션 타임아웃</Label>
                  <Select
                    value={security.sessionTimeout}
                    onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15분</SelectItem>
                      <SelectItem value="30">30분</SelectItem>
                      <SelectItem value="60">1시간</SelectItem>
                      <SelectItem value="120">2시간</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    비활성 상태가 지속되면 자동 로그아웃됩니다
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">비밀번호 변경</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">현재 비밀번호</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div></div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">새 비밀번호</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">비밀번호 확인</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button variant="outline">비밀번호 변경</Button>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>테마 및 언어</CardTitle>
                <CardDescription>화면 표시 설정을 관리합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>테마</Label>
                  <Select
                    value={appearance.theme}
                    onValueChange={(value) => setAppearance({ ...appearance, theme: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">라이트</SelectItem>
                      <SelectItem value="dark">다크</SelectItem>
                      <SelectItem value="system">시스템 설정</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>언어</Label>
                  <Select
                    value={appearance.language}
                    onValueChange={(value) => setAppearance({ ...appearance, language: value })}
                  >
                    <SelectTrigger className="w-48">
                      <Globe className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>시간대</Label>
                  <Select
                    value={appearance.timezone}
                    onValueChange={(value) => setAppearance({ ...appearance, timezone: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Seoul">서울 (GMT+9)</SelectItem>
                      <SelectItem value="Asia/Tokyo">도쿄 (GMT+9)</SelectItem>
                      <SelectItem value="America/New_York">뉴욕 (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">런던 (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
