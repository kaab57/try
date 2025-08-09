import Parser from 'rss-parser'

const parser = new Parser()

export async function GET() {
  try {
    const feed = await parser.parseURL('https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en')
    const items = (feed.items || []).slice(0, 15)
    return Response.json({ items })
  } catch (e: any) {
    return Response.json({ items: [], error: e?.message || 'failed' }, { status: 200 })
  }
}