import { NextRequest, NextResponse } from 'next/server';

/**
 * 범용 API 프록시 라우트 (catch-all)
 *
 * 브라우저 → /api/v1/* (same-origin) → 백엔드 /api/v1/* (서버-서버, CORS 무관)
 *
 * path를 그대로 전달합니다 (변환 없음):
 *   /api/v1/auth/*       → backend/api/v1/auth/*
 *   /api/v1/admin/*      → backend/api/v1/admin/*
 *   /api/v1/stocks/*     → backend/api/v1/stocks/*
 *   /api/v1/strategies/* → backend/api/v1/strategies/*
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10010';

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const backendPath = `/api/${path.join('/')}`;

  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${API_URL}${backendPath}${searchParams ? `?${searchParams}` : ''}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Authorization 헤더 전달
  const authorization = request.headers.get('authorization');
  if (authorization) {
    headers['Authorization'] = authorization;
  }

  try {
    const body = ['GET', 'HEAD'].includes(request.method)
      ? undefined
      : await request.text().catch(() => undefined);

    const response = await fetch(url, {
      method: request.method,
      headers,
      body: body || undefined,
      signal: AbortSignal.timeout(15000),
    });

    // 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10010';
    console.error(`Proxy error [${request.method} ${backendPath}]:`, error);
    const message =
      error instanceof DOMException && error.name === 'TimeoutError'
        ? '백엔드 서버 응답 시간이 초과되었습니다.'
        : `백엔드 서버에 연결할 수 없습니다. (${backendUrl}) Core API가 실행 중인지 확인하세요.`;
    return NextResponse.json({ error: message, message }, { status: 503 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
