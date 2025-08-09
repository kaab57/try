"use client"
import dynamic from 'next/dynamic'
import { Sidebar } from '@/components/Sidebar'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function StudioPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <main className="p-4">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-4">Code Studio</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-lg overflow-hidden">
              <MonacoEditor height="70vh" defaultLanguage="typescript" defaultValue={`// Start building an app or website\nfunction hello() {\n  console.log('Hello Agent!')\n}`} />
            </div>
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-2">Preview</h2>
              <div className="text-sm text-gray-500">Live preview will appear here. Save files to see updates.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}