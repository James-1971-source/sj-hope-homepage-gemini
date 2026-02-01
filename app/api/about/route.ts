import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notionApiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ABOUT;

    if (!notionApiKey) {
      console.error('❌ NOTION_API_KEY가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'NOTION_API_KEY is not set' },
        { status: 500 }
      );
    }

    if (!databaseId) {
      console.error('❌ NOTION_DATABASE_ABOUT가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'NOTION_DATABASE_ABOUT is not set' },
        { status: 500 }
      );
    }

    console.log('✅ Notion 기관정보 DB 조회 시작:', databaseId);

    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 1,
          filter: {
            property: '이름',
            title: {
              equals: '이사장 프로필',
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Notion API 실패:', errorText);
      return NextResponse.json(
        { error: 'Notion API failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Notion API 응답:', JSON.stringify(data, null, 2));

    if (data.results.length === 0) {
      console.warn('⚠️ "이사장 프로필" 페이지를 찾을 수 없습니다.');
      return NextResponse.json({ chairmanImage: null });
    }

    const page = data.results[0];
    const props = page.properties;

    const imageFiles = props['이미지']?.files || [];
    const chairmanImage = imageFiles.length > 0
      ? imageFiles[0].file?.url || imageFiles[0].external?.url || null
      : null;

    console.log('✅ 이사장 이미지 URL:', chairmanImage);

    return NextResponse.json({ 
      chairmanImage,
      name: props['이름 (한글)']?.rich_text?.[0]?.plain_text || '윤동성',
      position: props['직책']?.rich_text?.[0]?.plain_text || '이사장'
    });
  } catch (error) {
    console.error('❌ Error fetching about info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about info' },
      { status: 500 }
    );
  }
}
