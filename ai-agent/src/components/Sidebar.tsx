"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import { Brain, Mic, ImageIcon, Calendar, Newspaper, Settings, FolderCode } from 'lucide-react'

const items = [
  { href: '/', label: 'Chat', icon: Brain },
  { href: '/studio', label: 'Code Studio', icon: FolderCode },
  { href: '/images', label: 'Images', icon: ImageIcon },
  { href: '/reminders', label: 'Reminders', icon: Calendar },
  { href: '/news-weather', label: 'News & Weather', icon: Newspaper },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 p-4 hidden md:block">
      <div className="text-2xl font-bold mb-6">Agent</div>
      <nav className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition',
            pathname === href && 'bg-gray-100 dark:bg-gray-800'
          )}>
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}