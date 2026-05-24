# Backoffice 기술 부채 TODO

> **스코프 (Scope)**: Backoffice 단독 기술 부채 — 보안/RBAC/UX/디자인 시스템 리팩토링
> **문서 역할**: Backoffice 서비스 내부 개선 항목 관리
> **최종 업데이트**: 2026-05-24 전문가 패널(15명) 리뷰 결과 반영. 우선순위는 사업 가치 × 보안 리스크 × 구현 비용 기준.
>
> **여기 없는 것 (다른 곳에서 관리)**:
> - 제품 기능 우선순위 + 크로스 서비스 작업 → [../docs/할일.md](../docs/할일.md) (SSOT)
> - 백로그/이슈 트래킹 → Jira (`SCRUM-*`)

---

## 🚨 즉시 (Hotfix — 진행 중/완료 표기)

### 보안
- [ ] **`next` 15.4.2 → 15.5.18 이상 업그레이드** (CVE-2025-55184/55183, CVE-2026-44578 SSRF 패치)
- [ ] **Cloud Run `--allow-unauthenticated` 제거** → Cloudflare Access 또는 IAP 적용
- [ ] **catch-all 프록시(`api/[...path]/route.ts`) 강화**: 경로 화이트리스트, body 크기 제한, `NEXT_PUBLIC_API_URL` 폴백 제거
- [ ] **결제 confirm 라우트 강화**: 인증 검증 + amount 서버 비교 + idempotency key + DB 저장 TODO 완성

### CI/인프라
- [ ] Dockerfile `pnpm install --frozen-lockfile`로 변경
- [ ] 이미지 태그 `${{ github.sha }}` 추가 (롤백 가능성 확보)
- [ ] `.dockerignore`에 `.env.prod` 명시적 추가
- [ ] `package-lock.json` 삭제 + `.gitignore` 추가
- [ ] `.commitlintrc.json` rules 활성화
- [ ] GitHub Actions Secret 로드 후 `::add-mask::` 처리

### UI/UX 빠른 정리
- [ ] dashboard layout의 중복 `<Toaster>` 제거
- [ ] Sidebar `<h1>` 중복 해소 (Header에만 h1 유지)
- [ ] 알림 관리 메뉴 사이드바 disabled + "준비 중" 배지
- [ ] 사이드바/H1 레이블 통일 (분석 현황↔통계, 회원 관리↔사용자 관리)
- [ ] AdSense.tsx 백오피스에서 제거 (frontend로 이동 또는 삭제)

### 보안 헤더 (next.config.ts)
- [ ] CSP, X-Frame-Options DENY, HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options 추가

---

## 🔴 P0 — 2주 내

### 인증·권한
- [ ] **localStorage JWT → httpOnly 쿠키 전환** (BFF 세션 패턴)
- [ ] **`middleware.ts` 신규 생성** — `/dashboard/*`, `/api/*` 서버 수준 인증 가드
- [ ] AuthContext의 `tokenStorage` 중복 제거 (client.ts와 단일화)
- [ ] 로그인 rate limiting + 계정 잠금 + (선택) MFA(TOTP)

### Mock 데이터 → 실API
- [ ] 메인 dashboard/page.tsx **Today Panel** 신설 (승인 대기 N건/실패 결제 N건/스케줄러 실패 N건 실API)
- [ ] payments/page.tsx 실 API 연결 + 환불 처리 액션 + 결제 상세 라우트
- [ ] analytics/page.tsx 실 API 연결 (최소 MRR/NRR/Churn/LTV·CAC 카드)
- [ ] settings/page.tsx 저장 버튼 API 연결 (프로필, 알림, 비밀번호 변경)

### 운영성·관측성
- [ ] **Sentry/`@sentry/nextjs`** 통합 + `global-error.tsx` 추가
- [ ] **`/api/health` 헬스체크** 엔드포인트 + Cloud Run startup probe
- [ ] **운영자 액션 감사 로그(Audit Log)** 백엔드 설계 + 백오피스 인터셉터

### UX·UI 핵심
- [ ] `window.confirm/alert/prompt` 전수 제거 → Shadcn Dialog + Sonner (strategies, stocks, data)
- [ ] 사용자 테이블 행 단위 액션 추가 (상세 보기, 상태 변경, 강제 로그아웃)
- [ ] 데이터 운영 페이지 고위험 액션(Vertex AI, 전체 백테스트) 확인 다이얼로그 + 중복 실행 방지
- [ ] **아이콘 단독 버튼 `aria-label`** 전수 추가 (payments, strategies, stocks, news, Header)
- [ ] 검색 Input `<label>`/`aria-label` 추가
- [ ] recharts `accessibilityLayer` + `aria-label` 적용

### 아키텍처
- [ ] **DashboardLayout `'use client'` 제거** → `<AuthGuard>` 분리, layout은 RSC 유지
- [ ] 클라이언트 측 `filter()` 제거 (strategies, news) → 서버 검색 위임 (`pg_trgm` GIN 인덱스 백엔드 협조)

---

## 🟡 P1 — 1개월 내

### 상태 관리·데이터
- [ ] **TanStack Query 도입** — 11개 도메인 `useState+useEffect+useCallback` 패턴 일괄 마이그레이션
- [ ] **`nuqs` 도입** — 검색/필터/페이지 URL 동기화 (운영자 공유 링크·새로고침 대응)
- [ ] API 응답을 **Zod 스키마**로 전환 (또는 `openapi-typescript`로 자동 생성)
- [ ] API 클라이언트 401 인터셉터 + refresh token 흐름

### RBAC·운영자 도구
- [ ] **RBAC 4개 역할 설계**: CS / 콘텐츠 / 데이터운영자 / 슈퍼관리자
- [ ] RBAC 기반 사이드바 메뉴 필터링 + 액션 권한 검사
- [ ] CS 도구: 계정 정지 사유 입력, 환불 처리, 사용자 직접 메시지
- [ ] 종목 Designation Status (CAUTION/WARNING/RISK/SUSPENDED) 변경 UI + 이력 (PRD AC 5.2)
- [ ] 벌크 액션 패턴 (체크박스 + 플로팅 액션바) — 사용자/전략 우선
- [ ] 전략 정기 백테스트 스케줄러 관리 UI (PRD AC 3.5.3)

### 정보 아키텍처
- [ ] 사이드바 그룹핑 (운영 / 콘텐츠 / 시스템 / 설정)
- [ ] tier-config를 settings에서 분리 (개인 vs 시스템 정책)
- [ ] breadcrumb 추가 (3단계 이상 라우트)
- [ ] news-categories URL을 `/news/categories`로 변경 (계층 일관성)
- [ ] 글로벌 검색 → Command Palette (⌘K, `cmdk`)

### 디자인 시스템
- [ ] `--primary` 토큰을 emerald로 재정의 (RevenueChart/UserChart 색상 정상화)
- [ ] 시맨틱 상태 토큰(`--color-success/warning/error/info`) 정의 후 하드코딩 색상 클래스 교체
- [ ] surface depth 토큰(`--surface-0~3`) 추가
- [ ] `--chart-*` 토큰으로 차트 색상 통합
- [ ] 라이트/다크 혼재 해소 (다크 통일 또는 클래스 전환 강제)
- [ ] 폰트 등록(Inter)과 사용(`--font-geist-sans`) 불일치 수정 + `tabular-nums` 적용

### 인프라·DevOps
- [ ] Workload Identity Federation 전환 (GCP_SA_KEY JSON 제거)
- [ ] Cloud Run `--min-instances=1` + `--concurrency=20` + `--cpu-boost`
- [ ] Cloud Monitoring Uptime Check + Slack 알림
- [ ] Trivy 이미지 스캔 + Dependabot/Renovate 자동 업데이트
- [ ] OpenTelemetry + 구조화 로깅(pino, Cloud Logging severity 매핑)
- [ ] X-Request-ID/X-Cloud-Trace-Context 전파

### FE 성능
- [ ] analytics 차트 `dynamic({ ssr: false })`로 분리 (~170KB 초기 번들 감소)
- [ ] AuthContext를 State/Actions 컨텍스트로 분리 (리렌더 최소화)
- [ ] users/page.tsx의 `searchTimer` useState → useRef
- [ ] `@next/bundle-analyzer` 도입
- [ ] `images: { formats: ['image/avif', 'image/webp'] }` 추가
- [ ] `compiler: { removeConsole: { exclude: ['error'] } }` 추가

### DB 성능
- [ ] predictions API 페이지네이션 (size 파라미터)
- [ ] Vertex AI/백테스트 비동기 job polling 패턴 (202 + `/jobs/:id/status`)
- [ ] 필터 변경 시 stats COUNT 재실행 분리 (마운트 1회만)
- [ ] ETag/If-None-Match 조건부 요청 지원

---

## 🟢 P2 — 분기 내

### 그로스·마케팅 도구
- [ ] 코호트 리텐션 히트맵 + 전환 퍼널(가입→첫추천→구독→첫결제) 화면
- [ ] 알림 관리 페이지 실구현 (세그먼트 발송, 결제 실패 dunning 자동화)
- [ ] 쿠폰/프로모션 관리 + UTM Attribution + NPS 수집
- [ ] Feature Flag 관리 화면 (tier-config 확장)

### 아키텍처 리팩토링
- [ ] Feature-based 구조 점진 전환 (`features/{domain}/`)
- [ ] **frontend↔backoffice 공유 패키지 추출** (`packages/shared` — ApiError, tokenStorage, Zod 스키마, shadcn 공통)
- [ ] Vitest 단위 테스트 도입 + MSW
- [ ] React 19 `useActionState` + Server Actions로 단순 액션 마이그레이션

### 운영
- [ ] Cloud Run canary 트래픽 분리 (`--no-traffic` + `update-traffic`)
- [ ] 환경 분리 (dev/staging/prod) + GitHub Environment protection
- [ ] Secret Manager 시크릿 개별화 + `--set-secrets` 볼륨 마운트
- [ ] 백오피스 장애 런북 작성 (`docs/infra/backoffice-runbook.md`)
- [ ] 관리자 플로우 E2E 테스트 (Playwright)

### UX 고도화
- [ ] 테이블 가상화(TanStack Virtual) + 컬럼 정렬·페이지 크기 선택·점프 버튼
- [ ] Unsaved Changes Guard (편집 폼)
- [ ] 백그라운드 비동기 작업(Vertex AI, 백테스트) 진행 상태 패널
- [ ] 운영자 onboarding tour / 도움말 + 단축키
- [ ] prefers-reduced-motion 대응

---

## 📝 참고

- 전체 리뷰 리포트는 conversation 이력 참조 (15명 전문가 패널, 2026-05-24)
- 우선순위 결정 시 PRD v2.0의 North Star 지표 및 보안 리스크 우선
