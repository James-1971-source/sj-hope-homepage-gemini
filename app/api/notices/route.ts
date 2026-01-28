import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_NOTICES;

    // 환경 변수 체크
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NOTION_API_KEY is missing' },
        { status: 500 }
      );
    }

    if (!databaseId) {
      return NextResponse.json(
        { error: 'NOTION_DATABASE_NOTICES is missing' },
        { status: 500 }
      );
    }

    console.log('Fetching from Notion...');
    console.log('Database ID:', databaseId);

    // Notion API 호출 (필터/정렬 없이 단순하게)
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 10
        }),
        cache: 'no-store',
      }
    );

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notion API Error Response:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Notion API failed',
          status: response.status,
          message: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Success! Results count:', data.results?.length || 0);

    // 원본 데이터 그대로 반환
    return NextResponse.json(data);

  } catch (error) {
    console.error('Fatal Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
