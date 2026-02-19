# User Management [Draft]

사용자 관리 - 등록된 사용자 조회 및 관리

## Routes

- `/admin/users` - 사용자 목록
- `/admin/users/[id]` - 사용자 상세

## Features

### 1. 사용자 목록 (`/admin/users`)

| Item | Description |
|------|-------------|
| API | `GET /api/v1/admin/users` |
| 표시 항목 | 이름, 이메일, 가입일, 상태, KIS 연동 |
| 검색 | 이름, 이메일 검색 |
| 필터 | 상태 (활성/정지), KIS 연동 여부 |
| 정렬 | 가입일, 이름 |

### 2. 사용자 상세 (`/admin/users/[id]`)

| Item | Description |
|------|-------------|
| API | `GET /api/v1/users/{userId}` |

#### 기본 정보
| Field | Description |
|-------|-------------|
| 사용자 ID | UUID |
| 이름 | 표시 이름 |
| 이메일 | 이메일 주소 |
| 가입일 | 계정 생성일 |
| 상태 | 활성, 정지, 탈퇴 |

#### KIS 계좌 정보
| Item | Description |
|------|-------------|
| API | `GET /api/v1/users/{userId}/kis-accounts` |
| 표시 항목 | 계좌번호, 연결 상태, 등록일 |

#### 자동 매매 설정
| Item | Description |
|------|-------------|
| API | `GET /api/v1/users/{userId}/trading-config` |
| 표시 항목 | 활성화 여부, 최소 점수, 손절/익절 |

#### 잔고 정보
| Item | Description |
|------|-------------|
| API | `GET /api/v1/users/{userId}/balance` |
| 표시 항목 | 총 자산, 보유 종목, 수익률 |

#### 거래 내역
| Item | Description |
|------|-------------|
| API | `GET /api/v1/users/{userId}/trades` |
| 표시 항목 | 최근 거래 10건 |

### 3. 사용자 상태 변경

| Action | API | Description |
|--------|-----|-------------|
| 활성화 | `PATCH /users/{id}/status` | 정지 → 활성 |
| 정지 | `PATCH /users/{id}/status` | 활성 → 정지 |

### 4. 사용자 통계

| Item | Description |
|------|-------------|
| API | `GET /api/v1/admin/users/stats` |
| 표시 항목 | 총 사용자, 활성 비율, 신규 가입 추이 |

## UI Components

- `UserTable` - 사용자 목록 테이블
- `UserSearchBar` - 검색 입력
- `UserStatusBadge` - 상태 뱃지
- `UserDetailCard` - 사용자 상세 카드
- `KisAccountInfo` - KIS 연동 정보
- `TradingConfigView` - 자동 매매 설정 뷰
- `UserTradeHistory` - 최근 거래 리스트

## Acceptance Criteria

- [ ] 사용자 목록 페이지네이션
- [ ] 검색 시 300ms 디바운스
- [ ] 상태 변경 확인 다이얼로그
- [ ] 민감 정보 마스킹 (계좌번호 등)
