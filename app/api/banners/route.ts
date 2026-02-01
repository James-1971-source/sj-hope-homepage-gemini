import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_BANNERS || '';

export async function GET() {
  try {
    if (!databaseId) {
      console.log('NOTION_DATABASE_BANNERS not configured');
      return NextResponse.json([]);
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: '공개여부',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: '순서',
          direction: 'ascending',
        },
      ],
      page_size: 100,
    });

    const banners = response.results.map((page: any) => {
      const properties = page.properties;

      const title = properties['제목']?.title?.[0]?.plain_text || '';
      const description = properties['설명']?.rich_text?.[0]?.plain_text || '';
      const order = properties['순서']?.number || 0;
      const published = properties['공개여부']?.checkbox || false;

      let image = '';
      if (properties['이미지']?.files?.[0]) {
        const file = properties['이미지'].files[0];
        image = file.file?.url || file.external?.url || '';
      }

      return {
        id: page.id,
        title,
        description,
        image,
        order,
        published,
      };
    });

    console.log(`Fetched ${banners.length} banners`);
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}
