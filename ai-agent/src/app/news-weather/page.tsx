"use client"
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'

export default function NewsWeatherPage() {
  const [news, setNews] = useState<any[]>([])
  const [weather, setWeather] = useState<any | null>(null)

  useEffect(() => {
    fetch('/api/news').then(r=>r.json()).then(d=>setNews(d.items || []))
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async pos => {
        const { latitude, longitude } = pos.coords
        const r = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
        setWeather(await r.json())
      })
    } else {
      fetch('/api/weather').then(r=>r.json()).then(setWeather)
    }
  }, [])

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <main className="p-4">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-4">News & Weather</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <h2 className="font-semibold mb-2">Top News</h2>
              <ul className="space-y-2">
                {news.map((n, i) => (
                  <li key={i} className="border rounded-md p-3">
                    <a href={n.link} target="_blank" className="font-medium underline">{n.title}</a>
                    <div className="text-xs text-gray-500">{n.pubDate && new Date(n.pubDate).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Weather</h2>
              {weather ? (
                <div className="border rounded-md p-3">
                  <div className="text-4xl font-bold">{Math.round(weather.current?.temperature ?? 0)}°C</div>
                  <div className="text-sm text-gray-500">{weather.location || 'Current location'}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Fetching weather...</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}