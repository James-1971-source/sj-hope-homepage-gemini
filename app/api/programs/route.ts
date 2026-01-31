import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notionApiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_PROGRAMS;

    if (!notionApiKey) {
      return NextResponse.json(
        { error: 'NOTION_API_KEY is not set' },
        { status: 500 }
      );
    }

    if (!databaseId) {
      return NextResponse.json(
        { error: 'NOTION_DATABASE_PROGRAMS is not set' },
        { status: 500 }
      );
    }

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
          page_size: 100,
          sorts: [
            {
              property: '순서',
              direction: 'ascending',
            },
          ],
        }),
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

    const programs = data.results
      .map((page: any) => {
        const props = page.properties;

        const published = props['공개여부']?.checkbox ?? false;

        const name = props['이름']?.title?.[0]?.plain_text || '';
        const category = props['카테고리']?.select?.name || '';
        const description = props['설명']?.rich_text?.[0]?.plain_text || '';
        const target = props['대상']?.rich_text?.[0]?.plain_text || '';
        const period = props['기간']?.rich_text?.[0]?.plain_text || '';
        const order = props['순서']?.number ?? 999;

        const imageFiles = props['이미지']?.files || [];
        const image = imageFiles.length > 0
          ? imageFiles[0].file?.url || imageFiles[0].external?.url || null
          : null;

        return {
          id: page.id,
          name,
          category,
          description,
          target,
          period,
          image,
          order,
          published,
          url: page.url,
        };
      })
      .filter((program: any) => program.published);

    console.log(`✅ ${programs.length}개의 프로그램을 불러왔습니다.`);

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
