# Stock Master Management [Draft]

종목 마스터 관리 - 분석 대상 종목 데이터 관리

## Route

`/admin/stocks`

## Features

### 1. 종목 목록

| Item | Description |
|------|-------------|
| API | `GET /api/v1/stocks` |
| 표시 항목 | 티커, 종목명, 섹터, ETF 여부, 활성 상태 |
| 검색 | 티커, 종목명 검색 |
| 필터 | 섹터별, ETF 여부 |

### 2. 종목 추가

| Item | Description |
|------|-------------|
| API | `POST /api/v1/stocks` |
| 입력 항목 | 아래 참조 |

#### 입력 필드
| Field | Required | Description |
|-------|----------|-------------|
| ticker | Y | 종목 티커 (예: 005930) |
| name | Y | 종목명 (예: 삼성전자) |
| sector | N | 섹터 (예: 반도체) |
| isEtf | N | ETF 여부 |
| isActive | N | 분석 대상 여부 |

### 3. 종목 수정

| Item | Description |
|------|-------------|
| API | `PUT /api/v1/stocks/{ticker}` |
| 수정 항목 | 종목명, 섹터, ETF 여부, 활성 상태 |

### 4. 종목 삭제

| Item | Description |
|------|-------------|
| API | `DELETE /api/v1/stocks/{ticker}` |
| 주의 | 관련 분석 데이터도 삭제됨 |

### 5. 일괄 작업

| Action | Description |
|--------|-------------|
| 일괄 활성화 | 선택 종목 분석 대상 활성화 |
| 일괄 비활성화 | 선택 종목 분석 대상 제외 |
| CSV 가져오기 | 종목 일괄 등록 |
| CSV 내보내기 | 종목 목록 다운로드 |

## UI Components

- `StockTable` - 종목 목록 테이블 (체크박스 포함)
- `StockSearchBar` - 검색 입력
- `StockForm` - 종목 추가/수정 폼
- `SectorFilter` - 섹터 필터 드롭다운
- `BulkActionBar` - 일괄 작업 버튼
- `CsvImporter` - CSV 파일 업로드

## Acceptance Criteria

- [ ] 중복 티커 등록 방지
- [ ] 삭제 시 확인 다이얼로그
- [ ] CSV 형식 검증
- [ ] 일괄 작업 진행률 표시
