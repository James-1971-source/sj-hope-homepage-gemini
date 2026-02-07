import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const databaseId = process.env.NOTION_DATABASE_BUSINESS;
    
    if (!databaseId) {
      return NextResponse.json(
        { error: 'Database ID not configured' },
        { status: 500 }
      );
    }

    // 필터 설정
    const filter: any = {
      and: [
        {
          property: '공개여부',
          checkbox: {
            equals: true,
          },
        },
      ],
    };

    // 카테고리 필터 추가
    if (category) {
      filter.and.push({
        property: '카테고리',
        select: {
          equals: category,
        },
      });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: filter,
      sorts: [
        {
          property: '순서',
          direction: 'ascending',
        },
      ],
    });

    const businesses = response.results.map((page: any) => {
      const properties = page.properties;

      // 이미지 URL 추출
      const images = properties['이미지']?.files?.map((file: any) => {
        if (file.type === 'file') {
          return file.file.url;
        } else if (file.type === 'external') {
          return file.external.url;
        }
        return null;
      }).filter(Boolean) || [];

      return {
        id: page.id,
        title: properties['제목']?.title?.[0]?.plain_text || '',
        category: properties['카테고리']?.select?.name || '',
        overview: properties['개요']?.rich_text?.[0]?.plain_text || '',
        goal: properties['목표']?.rich_text?.[0]?.plain_text || '',
        target: properties['대상']?.rich_text?.[0]?.plain_text || '',
        content: properties['내용']?.rich_text?.[0]?.plain_text || '',
        achievement: properties['성과']?.rich_text?.[0]?.plain_text || '',
        images: images,
        order: properties['순서']?.number || 0,
        createdAt: properties['작성일']?.date?.start || page.created_time,
      };
    });

    return NextResponse.json(businesses);
  } catch (error: any) {
    console.error('Error fetching business data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business data', details: error.message },
      { status: 500 }
    );
  }
}
