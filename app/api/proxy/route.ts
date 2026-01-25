// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. URL에서 원래 이미지 주소를 추출합니다.
  const url = request.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing URL', { status: 400 });

  try {
    // 2. Vercel 서버가 노션(또는 외부) 서버로 이미지를 요청합니다.
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');

    // 3. 받아온 이미지 데이터를 브라우저에게 그대로 전달합니다.
    const blob = await response.blob();
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        // 중요: 브라우저에게 이 이미지를 1년간 캐시(저장)하라고 알립니다.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.error('Proxy Error:', e);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
