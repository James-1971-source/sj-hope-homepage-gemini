import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_PROGRAMS;

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
          sorts: [{ property: 'Order', direction: 'ascending' }]
        }),
        cache: 'no-store'
      }
    );

    const data = await response.json();
    
    const programs = data.results.map((page: any) => ({
      id: page.id,
      name: page.properties.Title?.title?.[0]?.plain_text || '',
      category: page.properties.Category?.select?.name || '',
      description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
      target: page.properties.Target?.multi_select?.map((t: any) => t.name) || [],
      period: page.properties.Period?.rich_text?.[0]?.plain_text || '',
      image: page.properties.Image?.files?.[0]?.file?.url || 
             page.properties.Image?.files?.[0]?.external?.url || '',
      order: page.properties.Order?.number || 999,
    }));

    return NextResponse.json({ programs });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
