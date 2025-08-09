"use client"
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) ? 'dark' : 'light')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceName, setVoiceName] = useState<string | null>(null)

  useEffect(() => {
    function loadVoices() {
      const v = window.speechSynthesis.getVoices()
      setVoices(v)
      const stored = localStorage.getItem('voiceName')
      if (stored) setVoiceName(stored)
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  function handleVoiceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setVoiceName(e.target.value)
    localStorage.setItem('voiceName', e.target.value)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <main className="p-4">
        <div className="container-max space-y-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-2">Theme</h2>
            <div className="flex gap-2">
              <button onClick={()=>setTheme('light')} className={`px-3 py-1 rounded-md border ${theme==='light'?'bg-gray-100 dark:bg-gray-800':''}`}>Light</button>
              <button onClick={()=>setTheme('dark')} className={`px-3 py-1 rounded-md border ${theme==='dark'?'bg-gray-100 dark:bg-gray-800':''}`}>Dark</button>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-2">Voice</h2>
            <select className="border rounded-md px-3 py-2 bg-transparent" value={voiceName ?? ''} onChange={handleVoiceChange}>
              <option value="">System Default</option>
              {voices.map(v => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>
        </div>
      </main>
    </div>
  )
}