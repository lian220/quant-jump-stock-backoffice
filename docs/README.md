# Backoffice 문서

Backoffice 문서는 운영자 웹앱 구현 상세를 다룹니다.  
전사 정책/공통 아키텍처는 루트 [docs](../../docs/README.md)를 기준으로 합니다.

## 문서 구조

```
docs/
├── README.md
├── features/             # 운영 기능 명세
├── architecture/         # (예정) 백오피스 구조/권한 설계
├── testing/              # (예정) 테스트 전략/실행 가이드
├── deployment/           # (예정) 배포/릴리즈 절차
└── troubleshooting/      # (예정) 운영 이슈 대응 가이드
```

## 빠른 시작

| 상황 | 문서 |
|------|------|
| 기능 구현 | [features](./features/README.md) |
| 테스트 공통 규칙 | [테스트_규칙.md](../../docs/testing/테스트_규칙.md) |
| 배포 절차 | [GCP 배포 가이드](../../docs/infra/구글클라우드플랫폼_배포.md) |

## 섹션 안내

### Architecture
- 운영자 권한 경계, 주요 페이지 흐름, API 의존성

### Features
- 사용자/종목/리포트/스케줄러/ML 운영 기능 상세

### Testing
- 관리 기능 회귀 테스트와 운영 시나리오 검증

### Deployment
- 환경별 배포 절차, 운영 반영 체크리스트

### Troubleshooting
- 운영 화면 오류와 데이터 불일치 대응 절차

## 루트 문서 연결

- [전사 문서 허브](../../docs/README.md)
- [API 계약](../../docs/api/)
- [공통 아키텍처](../../docs/architecture/)
- [테스트 규칙](../../docs/testing/테스트_규칙.md)
