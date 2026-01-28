import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ACTIVITIES; // 👈 DB 이름 변경

  if (!apiKey || !databaseId) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
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
          page_size: 100,
          filter: { property: 'Published', checkbox: { equals: true } },
          sorts: [{ property: 'Date', direction: 'descending' }]
        }),
        cache: 'no-store'
      }
    );

    const data = await response.json();
    
    const activities = data.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text || '',
      date: page.properties.Date?.date?.start || '',
      program: page.properties.Program?.select?.name || '',
      content: page.properties.Content?.rich_text?.[0]?.plain_text || '',
      thumbnail: page.properties.Thumbnail?.files?.[0]?.file?.url || 
                 page.properties.Thumbnail?.files?.[0]?.external?.url || '',
      participants: page.properties.Participants?.number || 0,
      tags: page.properties.Tags?.multi_select?.map((t: any) => t.name) || [],
    }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
