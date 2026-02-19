# Admin Dashboard [Draft]

관리자 대시보드 - 시스템 전체 현황 모니터링

## Route

`/admin`

## Features

### 1. 시스템 상태

| Item | Description |
|------|-------------|
| API | `GET /api/v1/scheduler` |
| 표시 항목 | 스케줄러 상태, 실행 중 작업 수 |
| 상태 | Running / Paused / Error |

### 2. 오늘 분석 현황

| Item | Description |
|------|-------------|
| API | `GET /api/v1/analyses/status` |
| 표시 항목 | 마지막 분석 시간, 분석된 종목 수, 성공/실패 |

### 3. 사용자 통계

| Item | Description |
|------|-------------|
| API | `GET /api/v1/admin/users/stats` |
| 표시 항목 | 총 사용자, 활성 사용자, 신규 가입 (오늘/주간) |

### 4. 거래 통계

| Item | Description |
|------|-------------|
| API | `GET /api/v1/admin/trades/stats` |
| 표시 항목 | 일간 거래량, 총 거래 금액, 평균 수익률 |

### 5. 예측 정확도

| Item | Description |
|------|-------------|
| API | `GET /api/v1/predictions/stats` |
| 표시 항목 | 예측 적중률, BUY 신호 성공률 |

### 6. 시스템 알림

| Item | Description |
|------|-------------|
| 표시 항목 | 최근 오류, 경고, 주요 이벤트 |
| 액션 | 알림 상세 보기, 해결 표시 |

## UI Components

- `SystemStatusCard` - 시스템 상태 카드
- `AnalysisStatusWidget` - 분석 현황 위젯
- `UserStatsCard` - 사용자 통계 카드
- `TradeStatsCard` - 거래 통계 카드
- `AlertList` - 시스템 알림 리스트

## Acceptance Criteria

- [ ] 자동 새로고침 (30초 간격)
- [ ] 오류 상태 시 빨간 알림
- [ ] 주요 지표 트렌드 표시 (↑↓)
- [ ] 카드 클릭 시 상세 페이지 이동
