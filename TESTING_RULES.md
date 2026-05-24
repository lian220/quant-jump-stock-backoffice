# Backoffice 테스트 규칙 (서비스 특화)

> **공통 규칙은 SSOT인 [../docs/testing/테스트_규칙.md](../docs/testing/테스트_규칙.md)를 참조한다.**
> 이 문서는 Backoffice 특화 사항만 기록한다.

## 실행 환경

- **개발 테스트**: `pnpm dev` (핫 리로드, 코드 수정 즉시 반영)
- **통합 테스트**: Docker 재빌드 (`./start.sh --build`)
- 통합 시작: 루트에서 `./start.sh --dev --build` (Backend Docker + Backoffice 핫 리로드)
- **포트**: 4010

## E2E 테스트 대상 페이지

| 페이지 | 경로 | 검증 항목 |
|--------|------|-----------|
| 대시보드 | `/dashboard` | 렌더링, 통계 로드 |
| 로그인 | `/auth` | 관리자 인증 |
| 전략 관리 | `/dashboard/strategies` | CRUD, 필터 |
| 전략 상세 | `/dashboard/strategies/[id]` | 데이터 로드, 편집 |
| 전략 생성 | `/dashboard/strategies/new` | 폼 입력, 저장 |
| 종목 관리 | `/dashboard/stocks` | CRUD, 검색 |
| 사용자 관리 | `/dashboard/users` | 목록, 역할 변경 |
| 결제 관리 | `/dashboard/payments` | 결제 내역 조회 |
| 분석 | `/dashboard/analytics` | 차트 렌더링 |
| 설정 | `/dashboard/settings` | 설정 변경 |

## 로그 확인

```bash
# 핫 리로드 모드 로그
tail -f .logs/backoffice.log

# Docker 모드 로그
docker logs -f qjs-backoffice
```
