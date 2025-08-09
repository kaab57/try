export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat') || '40.7128'
  const lon = searchParams.get('lon') || '-74.0060'

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
  const res = await fetch(url)
  const data = await res.json()

  return Response.json({
    location: undefined,
    current: {
      temperature: data?.current?.temperature_2m,
      weatherCode: data?.current?.weather_code,
    }
  })
}