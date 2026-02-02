# ML Model Management [Draft]

ML 모델 관리 - Vertex AI 모델 패키지 및 예측 작업 관리

## Route

`/admin/ml`

## Features

### 1. 모델 패키지 목록

| Item | Description |
|------|-------------|
| API | `GET /api/v1/ml-packages` |
| 표시 항목 | 패키지명, 버전, 업로드일, 상태 |

### 2. 모델 패키지 업로드

| Item | Description |
|------|-------------|
| API | `POST /api/v1/ml-packages` |
| 파일 형식 | .tar.gz (Python package) |
| 용량 제한 | 100MB |

### 3. Vertex AI 예측 실행

| Item | Description |
|------|-------------|
| API | `POST /api/v1/vertexai/predict` |
| 옵션 | 모델 선택, 파라미터 설정 |

#### 예측 파라미터
| Parameter | Description | Default |
|-----------|-------------|---------|
| modelType | lstm, transformer | lstm |
| epochs | 학습 반복 수 | 50 |
| learningRate | 학습률 | 0.001 |
| batchSize | 배치 크기 | 32 |

### 4. 예측 작업 상태

| Item | Description |
|------|-------------|
| API | `GET /api/v1/vertexai/status` |
| 표시 항목 | 작업 ID, 상태, 시작 시간, 진행률 |
| 상태 | Queued, Running, Succeeded, Failed |

### 5. 예측 결과 조회

| Item | Description |
|------|-------------|
| API | `GET /api/v1/predictions` |
| 필터 | 날짜, 종목, 신호 |
| 통계 | 정확도, 신뢰도 분포 |

### 6. 모델 성능 모니터링

| Item | Description |
|------|-------------|
| 표시 항목 | 예측 정확도, 신뢰도 평균, 신호 분포 |
| 차트 | 일자별 정확도 추이 |

## UI Components

- `PackageList` - 패키지 목록 테이블
- `PackageUploader` - 파일 업로드 드롭존
- `PredictionTrigger` - 예측 실행 폼
- `JobStatusCard` - 작업 상태 카드
- `AccuracyChart` - 정확도 추이 차트
- `ConfidenceHistogram` - 신뢰도 분포 히스토그램

## Acceptance Criteria

- [ ] 파일 업로드 진행률 표시
- [ ] 예측 실행 중 실시간 로그 표시
- [ ] 작업 실패 시 오류 상세 제공
- [ ] 모델 버전 비교 기능
