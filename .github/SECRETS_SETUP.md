# GitHub Secrets 설정 - Backoffice

> **참고**: Backoffice는 Frontend와 동일한 기술 스택 및 배포 방식을 사용합니다.
>
> **상세 가이드**: [Frontend Secrets 설정 가이드](../../quant-jump-stock-frontend/.github/SECRETS_SETUP.md) 참조

## 필수 GitHub Secrets (Frontend와 동일)

> **설정 위치**: GitHub Repository → Settings → Secrets and variables → Actions

### 1. GCP 인증
- **GCP_PROJECT_ID**: GCP 프로젝트 ID
- **GCP_SA_KEY**: Service Account JSON 키

### 2. Backend API 연결
- **API_BASE_URL**: `https://api.alphafoundry.app`

### 3. 외부 서비스 (선택)
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- 기타 NEXT_PUBLIC_* 환경변수

## 현재 설정 상태

```bash
# GitHub Secrets 확인
gh secret list --repo YOUR_USERNAME/quant-jump-stock-backoffice

# 현재 설정된 Secrets:
# ✓ API_BASE_URL
# ✓ AR_REPO
# ✓ GCP_PROJECT_ID
# ✓ GCP_SA_KEY
```

## Frontend와의 차이점

| 항목 | Frontend | Backoffice |
|------|----------|------------|
| 포트 | 3000 | 4000 |
| 대상 사용자 | 일반 사용자 | 운영자/관리자 |
| 추가 기능 | - | 데이터 차트 (recharts) |
| GitHub Secrets | 동일 | 동일 |
| 배포 방식 | Cloud Run | Cloud Run |

## 빠른 설정

Frontend와 동일한 Secrets를 사용하므로:

1. Backend 저장소의 Terraform 출력 확인
2. Frontend와 동일한 값으로 Secrets 등록
3. API_BASE_URL = `https://api.alphafoundry.app`

## 로컬 개발

```bash
# .env.local (Frontend와 동일)
NEXT_PUBLIC_API_URL=http://localhost:10010
NEXT_PUBLIC_SITE_URL=http://localhost:4000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 관련 문서

- **상세 설정 가이드**: [Frontend Secrets 설정](../../quant-jump-stock-frontend/.github/SECRETS_SETUP.md)
- **전체 배포 가이드**: Backend 저장소의 `/docs/technical/implemented/gcp-deployment.md`
- **Backend 설정**: [Backend Secrets 설정](../../quant-jump-stock-backend/.github/SECRETS_SETUP.md)
