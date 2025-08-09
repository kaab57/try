export async function GET() {
  const now = new Date()
  return Response.json({
    iso: now.toISOString(),
    locale: now.toLocaleString(),
    date: now.toDateString(),
    time: now.toLocaleTimeString(),
  })
}