import { SeoConfigProps } from '@/types/seo';

// 사이트 기본 SEO 설정
export const seoConfig: SeoConfigProps = {
  defaultTitle: 'Quant Jump Stock - Admin Console',
  titleTemplate: '%s | Quant Jump Admin',
  defaultDescription:
    'AI 기반 퀀트 트레이딩 관리 시스템. 실시간 시장 분석, 종목 추천, 자동 매매 시스템을 관리합니다.',
  defaultKeywords: 'Quant Jump, 퀀트 트레이딩, AI 주식 분석, 종목 추천, 자동 매매, 관리자 콘솔',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4010',
  siteName: 'Quant Jump Stock Admin',
  defaultImage: '/og-image.jpg',
  twitterUsername: '@quantjump',
  language: 'ko',
  locale: 'ko_KR',
};

// 페이지별 기본 SEO 설정들
export const pageDefaults = {
  home: {
    title: 'Quant Jump Stock 관리자 대시보드',
    description: 'AI 기반 퀀트 트레이딩 시스템의 실시간 모니터링 및 관리',
    keywords: '대시보드, 퀀트 분석, 종목 추천, 시스템 모니터링',
  },
  auth: {
    title: '관리자 로그인',
    description: '관리자 계정으로 시스템에 접속합니다',
    keywords: '관리자 로그인, 인증',
  },
  users: {
    title: '회원 관리',
    description: '회원 정보 조회 및 관리',
    keywords: '회원 관리, 사용자 관리',
  },
  recommendations: {
    title: '종목 추천',
    description: 'AI 분석 기반 종목 추천 관리',
    keywords: '종목 추천, AI 분석, 주식 추천',
  },
} as const;

// Open Graph 기본 이미지 설정
export const defaultOpenGraphImages = {
  home: '/images/og/home.jpg',
  auth: '/images/og/auth.jpg',
  default: '/images/og/default.jpg',
};

// 구조화된 데이터 템플릿들
export const structuredDataTemplates = {
  // 조직 정보
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/logo.png`,
    description: seoConfig.defaultDescription,
  },

  // 웹사이트 정보
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    inLanguage: seoConfig.language,
  },

  // 소프트웨어 애플리케이션 정보
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: seoConfig.siteName,
    description: seoConfig.defaultDescription,
    url: seoConfig.siteUrl,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Organization',
      name: 'Quant Jump Stock',
    },
  },
};
