export async function POST(req: Request) {
  const { messages } = await req.json()
  const openaiKey = process.env.OPENAI_API_KEY

  if (!openaiKey) {
    const last = messages?.[messages.length - 1]?.content || ''
    const answer = `Demo mode: You said: "${last}". I can help with reminders, news, weather, images, files, and more in this demo.`
    return Response.json({ answer })
  }

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages || [{ role: 'user', content: 'Hello' }],
        temperature: 0.7
      })
    })
    const data = await r.json()
    const answer = data?.choices?.[0]?.message?.content || 'Sorry, no response.'
    return Response.json({ answer })
  } catch (e: any) {
    return Response.json({ answer: 'Error contacting model', error: e?.message }, { status: 200 })
  }
}