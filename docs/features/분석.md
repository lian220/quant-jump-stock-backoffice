# Analysis Management [Draft]

분석 관리 - 기술적/감성/통합 분석 수동 실행 및 결과 조회

## Route

`/admin/analysis`

## Features

### 1. 분석 상태

| Item | Description |
|------|-------------|
| API | `GET /api/v1/analyses/status` |
| 표시 항목 | 마지막 실행 시간, 다음 예정 시간, 분석 종목 수 |

### 2. 수동 분석 실행

#### 기술적 분석
| Item | Description |
|------|-------------|
| API | `POST /api/v1/analyses/technical` |
| 분석 항목 | SMA, RSI, MACD, Bollinger Bands |
| 옵션 | 전체 종목 / 특정 종목 선택 |

#### 감성 분석
| Item | Description |
|------|-------------|
| API | `POST /api/v1/analyses/sentiment` |
| 분석 항목 | 뉴스 감성 점수 |
| 소스 | Alpha Vantage NEWS_SENTIMENT |

#### 통합 분석
| Item | Description |
|------|-------------|
| API | `POST /api/v1/analyses/combined` |
| 순서 | 기술적 → 감성 → 경제 → 복합 점수 |

#### 병렬 분석
| Item | Description |
|------|-------------|
| API | `POST /api/v1/analyses/parallel` |
| 동작 | 기술적 + 감성 동시 실행 |

### 3. 분석 결과 조회

| Item | Description |
|------|-------------|
| API | `GET /api/v1/predictions/stats` |
| 표시 항목 | 종목별 점수 분포, 신호 통계 |

### 4. 분석 로그

| Item | Description |
|------|-------------|
| 표시 항목 | 실행 시간, 분석 유형, 종목 수, 소요 시간, 결과 |
| 필터 | 분석 유형, 날짜 |
| 상세 | 종목별 분석 결과 |

## UI Components

- `AnalysisStatusCard` - 분석 상태 카드
- `ManualTriggerButtons` - 수동 실행 버튼 그룹
- `AnalysisResultsChart` - 점수 분포 차트
- `SignalDistribution` - 신호별 통계 파이 차트
- `AnalysisLogTable` - 분석 로그 테이블

## Acceptance Criteria

- [ ] 분석 실행 중 로딩 상태 표시
- [ ] 실행 완료 시 토스트 알림
- [ ] 실패 시 오류 상세 표시
- [ ] 분석 결과 CSV 내보내기
