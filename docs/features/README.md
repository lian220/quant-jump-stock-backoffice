# Backoffice Features

관리자용 웹 애플리케이션 기능 정의

## Status

| Feature | Status | Priority |
|---------|--------|----------|
| [Admin Dashboard](./관리자_대시보드.md) | Draft | P0 |
| [Scheduler](./스케줄러.md) | Draft | P0 |
| [Analysis](./분석.md) | Draft | P1 |
| [ML Models](./머신러닝_모델.md) | Draft | P1 |
| [Users](./사용자.md) | Draft | P1 |
| [Economic Data](./경제_데이터.md) | Draft | P2 |
| [Stocks](./종목.md) | Draft | P2 |
| [Reports](./리포트.md) | Draft | P2 |

## Page Structure

```
/admin                  # Admin dashboard
/admin/scheduler        # Scheduler management
/admin/analysis         # Analysis management
/admin/ml               # ML model management
/admin/users            # User management
/admin/users/[id]       # User detail
/admin/economic         # Economic data
/admin/stocks           # Stock master
/admin/reports          # Reports & statistics
```

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn/ui
- Supabase Auth (Admin role)
