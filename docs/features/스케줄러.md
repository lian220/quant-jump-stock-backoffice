# Scheduler Management [Draft]

스케줄러 관리 - Quartz 스케줄러 작업 모니터링 및 제어

## Route

`/admin/scheduler`

## Features

### 1. 스케줄러 상태

| Item | Description |
|------|-------------|
| API | `GET /api/v1/scheduler` |
| 표시 항목 | 실행 상태, 시작 시간, 실행 중 작업 |
| 상태 | Running / Standby / Shutdown |

### 2. 스케줄 목록

| Item | Description |
|------|-------------|
| API | `GET /api/v1/scheduler/schedules` |
| 표시 항목 | 작업명, Cron 표현식, 다음 실행 시간, 상태 |

#### 등록된 스케줄
| Job | Cron | Description |
|-----|------|-------------|
| ParallelAnalysisJob | 0 5 23 * * ? | 병렬 분석 (기술+감성) |
| CombinedAnalysisJob | 0 45 23 * * ? | 통합 분석 (기술+감성+경제) |
| AutoBuyJobAdapter | 0 0 * * * ? | 자동 매수 실행 |
| AutoSellJobAdapter | 0 0 * * * ? | 자동 매도 실행 |
| EconomicDataUpdateJob | 0 0 6 * * ? | 경제 지표 업데이트 |
| PortfolioProfitReportJob | 0 0 16 * * ? | 일일 수익 리포트 |

### 3. 작업 제어

| Action | API | Description |
|--------|-----|-------------|
| 일시정지 | `POST /scheduler/{name}/pause` | 특정 작업 일시정지 |
| 재개 | `POST /scheduler/{name}/resume` | 일시정지된 작업 재개 |
| 즉시 실행 | `POST /scheduler/{name}/trigger` | 수동 즉시 실행 |

### 4. 스케줄러 전체 제어

| Action | API | Description |
|--------|-----|-------------|
| 시작 | `POST /scheduler/start` | 전체 스케줄러 시작 |
| 중지 | `POST /scheduler/stop` | 전체 스케줄러 중지 |

### 5. 실행 이력

| Item | Description |
|------|-------------|
| 표시 항목 | 실행 시간, 작업명, 소요 시간, 결과 |
| 필터 | 작업별, 성공/실패 |
| 기간 | 최근 7일 |

## UI Components

- `SchedulerStatusBadge` - 스케줄러 상태 뱃지
- `ScheduleTable` - 스케줄 목록 테이블
- `JobControlButtons` - 작업 제어 버튼
- `ExecutionHistory` - 실행 이력 테이블
- `CronDisplay` - Cron 표현식 + 사람 읽기 가능 형태

## Acceptance Criteria

- [ ] 작업 상태 실시간 반영
- [ ] 일시정지/재개 확인 다이얼로그
- [ ] 즉시 실행 시 로딩 표시
- [ ] 실행 실패 시 오류 메시지 표시
