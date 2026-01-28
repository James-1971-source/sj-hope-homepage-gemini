import { Client } from '@notionhq/client';

// Notion 클라이언트 초기화
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Database IDs
export const DATABASE_IDS = {
  notices: process.env.NOTION_DATABASE_NOTICES || '',
  activities: process.env.NOTION_DATABASE_ACTIVITIES || '',
  reports: process.env.NOTION_DATABASE_REPORTS || '',
  programs: process.env.NOTION_DATABASE_PROGRAMS || '',
  donation: process.env.NOTION_DATABASE_DONATION || '',
  about: process.env.NOTION_DATABASE_ABOUT || '',
};

// Notion 페이지 조회 함수
export async function getNotionPages(databaseId: string) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });
    
    return response.results;
  } catch (error) {
    console.error('Notion API Error:', error);
    return [];
  }
}

// 특정 페이지 상세 조회
export async function getNotionPage(pageId: string) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    return page;
  } catch (error) {
    console.error('Notion API Error:', error);
    return null;
  }
}
