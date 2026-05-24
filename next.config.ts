import type { NextConfig } from "next";

// 운영자용 백오피스 보안 헤더
// CSP는 Next.js inline script(boot)와 next/image inline style을 위해 unsafe-inline 허용.
// nonce 기반 CSP는 별도 마이그레이션 대상으로 분리.
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; '),
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      // ── 전역 보안 헤더 ──
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // ── 정적 자산 (빌드 해시 포함) → 영구 캐시 ──
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // ── 이미지 → 1일 캐시 + SWR 12시간 ──
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=43200' },
        ],
      },
      // ── 폰트 → 1년 캐시 ──
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // ── 아이콘 (PWA 아이콘 포함) → 7일 캐시 ──
      {
        source: '/icons/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      // ── favicon, manifest, robots, sitemap → 1일 캐시 ──
      {
        source: '/:path(favicon.ico|site.webmanifest|robots.txt|sitemap.xml)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      // ── Service Worker → 항상 최신 (PWA 업데이트 보장) ──
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, no-cache, must-revalidate' },
        ],
      },
      // ── API 라우트 → 캐시 금지 ──
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
      // ── Next.js RSC/Data → 짧은 캐시 + SWR ──
      {
        source: '/_next/data/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
