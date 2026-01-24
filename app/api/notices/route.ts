// app/api/notices/route.ts
import { NextResponse } from 'next/server';

// [추가] 이 줄을 추가하면 Vercel이 캐시를 쓰지 않고 항상 노션에서 새 데이터를 가져옵니다.
export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 6 }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
