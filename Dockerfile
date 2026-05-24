# Backoffice Dockerfile for Next.js
FROM node:20-alpine AS base

# Install pnpm (버전 고정으로 재현성 보장)
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (lockfile 강제 — CI 재현성)
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# 빌드 타임에 NEXT_PUBLIC_* 환경변수 주입 (클라이언트 컴포넌트에 인라인됨)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Build Next.js app
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 4000

CMD ["node", "server.js"]
