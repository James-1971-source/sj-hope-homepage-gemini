// app/api/notices/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_NOTICES; // 👈 이름만 변경

  // 환경 변수 체크 추가
  if (!apiKey || !databaseId) {
    return NextResponse.json(
      { error: 'Missing environment variables' }, 
      { status: 500 }
    );
  }

  try {
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
          page_size: 100, // 👈 6 → 100으로 증가
          filter: {
            property: 'Published',
            checkbox: {
              equals: true
            }
          },
          sorts: [
            {
              property: 'Date',
              direction: 'descending'
            }
          ]
        }),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    
    // 👇 데이터 정리 (사용하기 쉽게)
    const notices = data.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text || '',
      date: page.properties.Date?.date?.start || '',
      category: page.properties.Category?.select?.name || '',
      content: page.properties.Content?.rich_text?.[0]?.plain_text || '',
      published: page.properties.Published?.checkbox || false,
      pinned: page.properties.Pinned?.checkbox || false,
    }));

    return NextResponse.json({ notices });
    
  } catch (error) {
    console.error('Notion API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notices' }, 
      { status: 500 }
    );
  }
}
