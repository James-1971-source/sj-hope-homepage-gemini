import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ACTIVITIES;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: 'Environment variables missing' },
        { status: 500 }
      );
    }

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
              property: '활동날짜',
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
    
    const activities = data.results
      .filter((page: any) => page.properties['공개여부']?.checkbox === true)
      .map((page: any) => ({
        id: page.id,
        title: page.properties['이름']?.title?.[0]?.plain_text || '제목 없음',
        date: page.properties['활동날짜']?.date?.start || '',
        program: page.properties['프로그램']?.select?.name || '',
        content: page.properties['내용']?.rich_text?.[0]?.plain_text || '',
        participantCount: page.properties['참여인원']?.number || 0,
        participants: page.properties['참가자']?.rich_text?.[0]?.plain_text || '',
        location: page.properties['장소']?.rich_text?.[0]?.plain_text || '',
        photos: page.properties['사진']?.files?.map((file: any) => 
          file.file?.url || file.external?.url || ''
        ).filter((url: string) => url !== '') || [],
        tags: page.properties['태그']?.multi_select?.map((t: any) => t.name) || [],
        url: page.url,
      }));

    console.log(`✅ ${activities.length}개의 활동소식을 불러왔습니다.`);

    return NextResponse.json(activities);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Server error', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

