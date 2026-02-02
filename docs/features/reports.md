# Reports [Draft]

리포트 - 예측 및 거래 통계 분석 리포트

## Route

`/admin/reports`

## Features

### 1. 예측 통계

| Item | Description |
|------|-------------|
| API | `GET /api/v1/predictions/stats` |
| 표시 항목 | 아래 참조 |

#### 예측 지표
| Metric | Description |
|--------|-------------|
| 총 예측 수 | 기간 내 예측 건수 |
| 신호 분포 | BUY / SELL / HOLD 비율 |
| 평균 신뢰도 | 예측 신뢰도 평균 |
| 적중률 | 예측 방향 일치율 |

### 2. 일자별 예측 조회

| Item | Description |
|------|-------------|
| API | `GET /api/v1/predictions/date/{date}` |
| 표시 항목 | 해당 일자 전체 예측 결과 |

### 3. 거래 리포트

| Item | Description |
|------|-------------|
| API | `GET /api/v1/admin/trades/report` |
| 표시 항목 | 아래 참조 |

#### 거래 지표
| Metric | Description |
|--------|-------------|
| 총 거래 수 | 기간 내 체결 건수 |
| 총 거래 금액 | 매수 + 매도 금액 합계 |
| 사용자별 수익률 | 평균, 중앙값, 최고/최저 |
| 종목별 수익률 | 종목별 평균 수익률 |

### 4. 기간별 분석

| Period | Description |
|--------|-------------|
| 일간 | 오늘 통계 |
| 주간 | 최근 7일 |
| 월간 | 최근 30일 |
| 분기 | 최근 90일 |
| 전체 | 서비스 시작 후 전체 |

### 5. 차트 및 시각화

| Chart | Description |
|-------|-------------|
| 신호 분포 | 파이 차트 |
| 적중률 추이 | 라인 차트 (일자별) |
| 수익률 분포 | 히스토그램 |
| 종목별 성과 | 바 차트 |

### 6. 내보내기

| Format | Description |
|--------|-------------|
| CSV | 원시 데이터 다운로드 |
| PDF | 리포트 형식 다운로드 |

## UI Components

- `PredictionStatsCard` - 예측 통계 카드
- `SignalDistributionPie` - 신호 분포 파이 차트
- `AccuracyTrendLine` - 적중률 추이 라인 차트
- `TradeStatsCard` - 거래 통계 카드
- `ProfitHistogram` - 수익률 분포 히스토그램
- `DateRangePicker` - 기간 선택기
- `ExportButtons` - 내보내기 버튼

## Acceptance Criteria

- [ ] 기간 선택 시 실시간 데이터 갱신
- [ ] 차트 호버 시 상세 수치 툴팁
- [ ] CSV/PDF 내보내기 기능
- [ ] 빈 데이터 시 안내 메시지
