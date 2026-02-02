# Backoffice Features

관리자용 웹 애플리케이션 기능 정의

## Status

| Feature | Status | Priority |
|---------|--------|----------|
| [Admin Dashboard](./admin-dashboard.md) | Draft | P0 |
| [Scheduler](./scheduler.md) | Draft | P0 |
| [Analysis](./analysis.md) | Draft | P1 |
| [ML Models](./ml-models.md) | Draft | P1 |
| [Users](./users.md) | Draft | P1 |
| [Economic Data](./economic-data.md) | Draft | P2 |
| [Stocks](./stocks.md) | Draft | P2 |
| [Reports](./reports.md) | Draft | P2 |

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
