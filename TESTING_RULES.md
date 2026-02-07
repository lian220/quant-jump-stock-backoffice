# Backoffice 테스트 규칙

## 실행 환경

- **개발 테스트**: `pnpm dev` (핫 리로드, 코드 수정 즉시 반영)
- **통합 테스트**: Docker 재빌드 (`./start.sh --build`)
- 통합 시작: 루트에서 `./start.sh --dev --build` (Backend Docker + Backoffice 핫 리로드)

## 테스트 절차

1. **테스트 플랜 작성**: 테스트 전 플랜 문서 작성
2. **E2E 화면 테스트 필수**: Playwright MCP로 http://localhost:4000 에서 실제 브라우저 검증
3. **테스트 결과 보고**: 완료 후 사용자에게 결과 보고 + 결과 문서 작성

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
