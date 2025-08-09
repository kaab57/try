export async function POST(req: Request) {
  const { prompt } = await req.json()
  const stabilityKey = process.env.STABILITY_API_KEY

  if (!stabilityKey) {
    const seed = encodeURIComponent(prompt || 'agent')
    const url = `https://picsum.photos/seed/${seed}/1024/768`
    return Response.json({ url })
  }

  // Example Stability simple text-to-image call
  try {
    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stabilityKey}`
      },
      body: (() => {
        const form = new FormData()
        form.append('prompt', prompt || 'A friendly assistant robot, 3d render')
        form.append('output_format', 'png')
        return form
      })()
    })

    if (!response.ok) throw new Error(await response.text())
    const arrayBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const url = `data:image/png;base64,${base64}`
    return Response.json({ url })
  } catch (e: any) {
    const seed = encodeURIComponent(prompt || 'agent')
    const url = `https://picsum.photos/seed/${seed}/1024/768`
    return Response.json({ url, error: e?.message }, { status: 200 })
  }
}