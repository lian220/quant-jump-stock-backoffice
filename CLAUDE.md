# CLAUDE.md - Backoffice

이 파일은 Backoffice 프로젝트 작업 시 Claude Code가 참고하는 가이드입니다.

## Frontend 규칙 참조

Backoffice는 Frontend와 동일한 기술 스택을 사용합니다.
**[Frontend CLAUDE.md](../quant-jump-stock-frontend/CLAUDE.md)** 의 모든 규칙을 따릅니다.

## Backoffice 전용 사항

### 포트
```bash
# 개발 서버 (포트 4000)
pnpm dev

# 프로덕션 (포트 4000)
pnpm start
```

### 추가 라이브러리
| 라이브러리 | 용도 |
|-----------|------|
| recharts | 차트/그래프 시각화 |
| playwright | E2E 테스트 (devDependency) |

### 대상 사용자
- 운영자/관리자용 대시보드
- 사용자 관리, 결제 관리, 시스템 모니터링

### 명령어
```bash
pnpm install     # 의존성 설치
pnpm dev         # 개발 서버 (포트 4000)
pnpm build       # 프로덕션 빌드
pnpm start       # 프로덕션 실행
pnpm lint        # 린트 검사
```

## 공통 규칙 요약

- TypeScript 필수
- Tailwind CSS + Shadcn/ui 컴포넌트
- 다크 테마 기본 (slate-900 배경, emerald 강조색)
- 한글 주석 권장
- 커밋: `feat|fix|docs|style|refactor|test|chore: 작업내용`

자세한 내용은 [Frontend CLAUDE.md](../quant-jump-stock-frontend/CLAUDE.md) 참조.
