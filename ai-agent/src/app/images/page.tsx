"use client"
import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'

export default function ImagesPage() {
  const [prompt, setPrompt] = useState('a friendly robot assistant, 3d, soft light')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setImageUrl(null)
    const res = await fetch('/api/image', { method: 'POST', body: JSON.stringify({ prompt }) })
    const data = await res.json()
    setImageUrl(data.url)
    setLoading(false)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <main className="p-4">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-4">Image Generation</h1>
          <form onSubmit={handleGenerate} className="flex gap-2 mb-4">
            <input className="flex-1 border rounded-md px-3 py-2 bg-transparent" value={prompt} onChange={e=>setPrompt(e.target.value)} />
            <button disabled={loading} className="px-4 py-2 rounded-md bg-brand-600 text-white">{loading ? 'Generating...' : 'Generate'}</button>
          </form>
          {imageUrl && (
            <div className="space-y-2">
              <img src={imageUrl} alt="Generated" className="max-w-full rounded-md border" />
              <a href={imageUrl} download className="text-brand-600 underline">Download</a>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}