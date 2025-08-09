"use client"
import { Sidebar } from '@/components/Sidebar'
import { useVoiceAgent } from '@/hooks/useVoiceAgent'
import { useClapDetector } from '@/hooks/useClapDetector'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Page() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')
  const { listening, transcript, start, stop, speak } = useVoiceAgent()
  const { triggeredAt } = useClapDetector({ threshold: 0.78 })

  const selectedVoice = useMemo(() => {
    const voiceName = typeof window !== 'undefined' ? localStorage.getItem('voiceName') : null
    if (!voiceName) return undefined
    const vs = typeof window !== 'undefined' ? window.speechSynthesis.getVoices() : []
    return vs.find(v => v.name === voiceName)
  }, [typeof window !== 'undefined' && (window as any).speechSynthesis?.getVoices?.()])

  useEffect(() => {
    if (triggeredAt) start()
  }, [triggeredAt, start])

  useEffect(() => {
    if (!listening && transcript) {
      handleSend(transcript)
    }
  }, [listening])

  function maybeQuickOpen(text: string): boolean {
    const lower = text.toLowerCase()
    const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')
    if (lower.includes('open youtube')) { open('https://www.youtube.com'); return true }
    if (lower.includes('open wikipedia')) { open('https://www.wikipedia.org'); return true }
    if (lower.includes('open google')) { open('https://www.google.com'); return true }
    if (lower.includes('open gmail')) { open('https://mail.google.com'); return true }
    return false
  }

  async function handleSend(text?: string) {
    const content = (text ?? input).trim()
    if (!content) return
    if (maybeQuickOpen(content)) return
    const next = [...messages, { role: 'user' as const, content }]
    setMessages(next)
    setInput('')
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) })
    const data = await res.json()
    const answer = data.answer || 'Sorry, I could not respond.'
    const withAssistant = [...next, { role: 'assistant' as const, content: answer }]
    setMessages(withAssistant)
    speak(answer, selectedVoice)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <main className="p-4">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-4">Chat</h1>
          <div className="border rounded-lg p-4 h-[70vh] flex flex-col">
            <div className="flex-1 overflow-auto space-y-2" id="messages">
              {messages.map((m, i) => (
                <div key={i} className={`px-3 py-2 rounded-md max-w-[80%] ${m.role==='user'?'bg-brand-100 self-end':'bg-gray-100 dark:bg-gray-800'}`}>{m.content}</div>
              ))}
              {listening && (
                <div className="text-xs text-gray-500">Listening... {transcript}</div>
              )}
            </div>
            <form onSubmit={(e)=>{e.preventDefault(); handleSend()}} className="mt-4 flex gap-2">
              <input className="flex-1 border rounded-md px-3 py-2 bg-transparent" placeholder="Type a message..." value={input} onChange={e=>setInput(e.target.value)} />
              <button className="px-4 py-2 rounded-md border" type="button" onClick={listening?stop:start}>{listening ? 'Stop' : 'Voice'}</button>
              <button className="px-4 py-2 rounded-md bg-brand-600 text-white">Send</button>
            </form>
            <div className="text-xs text-gray-500 mt-2">Clap or snap to start listening. Quick opens: "open youtube", "open wikipedia", "open google", "open gmail".</div>
          </div>
        </div>
      </main>
    </div>
  )
}