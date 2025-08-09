"use client"
import useSWR from 'swr'
import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function RemindersPage() {
  const { data, mutate } = useSWR('/api/reminders', fetcher)
  const [title, setTitle] = useState('')
  const [dueAt, setDueAt] = useState('')

  async function addReminder(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/reminders', { method: 'POST', body: JSON.stringify({ title, dueAt }) })
    setTitle(''); setDueAt('')
    mutate()
  }

  async function toggleDone(id: number, done: boolean) {
    await fetch('/api/reminders', { method: 'PUT', body: JSON.stringify({ id, done: !done }) })
    mutate()
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <main className="p-4">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-4">Reminders</h1>
          <form onSubmit={addReminder} className="flex gap-2 mb-4">
            <input className="flex-1 border rounded-md px-3 py-2 bg-transparent" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <input className="border rounded-md px-3 py-2 bg-transparent" type="datetime-local" value={dueAt} onChange={e=>setDueAt(e.target.value)} />
            <button className="px-4 py-2 rounded-md bg-brand-600 text-white">Add</button>
          </form>
          <ul className="space-y-2">
            {data?.reminders?.map((r: any) => (
              <li key={r.id} className="border rounded-md p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-gray-500">Due {new Date(r.dueAt).toLocaleString()}</div>
                </div>
                <button onClick={()=>toggleDone(r.id, r.done)} className="text-sm px-3 py-1 rounded-md border">{r.done ? 'Mark Undone' : 'Mark Done'}</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}