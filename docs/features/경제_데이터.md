# Economic Data Management [Draft]

경제 지표 관리 - 분석에 사용되는 경제 데이터 관리

## Route

`/admin/economic`

## Features

### 1. 경제 지표 목록

| Item | Description |
|------|-------------|
| API | `GET /api/v1/economic-data` |
| 표시 항목 | 지표명, 현재값, 갱신일, 트렌드 |

#### 주요 지표
| Indicator | Description |
|-----------|-------------|
| 기준금리 | 한국은행 기준금리 |
| 인플레이션 | 소비자물가지수 상승률 |
| GDP 성장률 | 분기별 GDP 성장률 |
| 실업률 | 통계청 실업률 |
| 환율 | USD/KRW 환율 |

### 2. 지표 상세 조회

| Item | Description |
|------|-------------|
| 표시 항목 | 히스토리 차트, 통계, 데이터 소스 |
| 기간 | 1년, 3년, 5년 |

### 3. 수동 업데이트

| Item | Description |
|------|-------------|
| API | `POST /api/v1/economic-data/update` |
| 동작 | 외부 소스에서 최신 데이터 가져오기 |

### 4. 지표 추가

| Item | Description |
|------|-------------|
| API | `POST /api/v1/economic-data` |
| 입력 항목 | 지표명, 코드, 데이터 소스, 갱신 주기 |

### 5. 지표 수정

| Item | Description |
|------|-------------|
| API | `PUT /api/v1/economic-data/{id}` |
| 수정 항목 | 지표명, 갱신 주기, 가중치 |

## UI Components

- `EconomicIndicatorTable` - 지표 목록 테이블
- `IndicatorChart` - 지표 히스토리 차트
- `TrendBadge` - 트렌드 표시 (↑↓→)
- `UpdateButton` - 수동 업데이트 버튼
- `IndicatorForm` - 지표 추가/수정 폼

## Acceptance Criteria

- [ ] 지표별 트렌드 아이콘 표시
- [ ] 차트 기간 선택 가능
- [ ] 업데이트 실패 시 오류 표시
- [ ] 지표 삭제 확인 다이얼로그
