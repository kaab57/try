export async function POST(req: Request) {
  const { target, action } = await req.json()
  // In web demo, we cannot open native apps. Return URL mapping hints.
  const map: Record<string, string> = {
    youtube: 'https://www.youtube.com',
    wikipedia: 'https://www.wikipedia.org',
    google: 'https://www.google.com',
    gmail: 'https://mail.google.com',
  }
  const url = map[target?.toLowerCase?.()] || null
  return Response.json({ ok: true, hintUrl: url, note: 'On web, use window.open with hintUrl. On desktop app, this would invoke native shell.' })
}