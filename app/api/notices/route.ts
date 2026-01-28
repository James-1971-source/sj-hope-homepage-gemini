import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_NOTICES;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: 'Environment variables missing' },
        { status: 500 }
      );
    }

    // Notion API 호출
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
          page_size: 100,
          sorts: [
            {
              property: '공지 날짜 (Notice Date)',
              direction: 'descending'
            }
          ]
        }),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Notion API failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 🔄 데이터 정리 및 변환
    const notices = data.results
      .filter((page: any) => {
        // 공개여부가 true인 것만 필터링
        return page.properties['공개여부']?.checkbox === true;
      })
      .map((page: any) => ({
        id: page.id,
        title: page.properties['이름']?.title?.[0]?.plain_text || '제목 없음',
        date: page.properties['공지 날짜 (Notice Date)']?.date?.start || '',
        category: page.properties['카테고리']?.select?.name || '일반',
        content: page.properties['내용']?.rich_text?.[0]?.plain_text || '',
        pinned: page.properties['고정']?.checkbox || false,
        views: page.properties['조회수']?.number || 0,
        url: page.url,
      }));

    console.log(`✅ ${notices.length}개의 공지사항을 불러왔습니다.`);

    return NextResponse.json(notices);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Server error', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
