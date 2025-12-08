'use client'

import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui'
import Link from 'next/link'

interface HeaderProps {
  title: string
  action?: {
    label: string
    href: string
  }
}

const Header = ({ title, action }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

        <div className="flex items-center gap-4">
          {action && (
            <Link href={action.href}>
              <Button>{action.label}</Button>
            </Link>
          )}

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
          </button>

          {/* User Menu */}
          <Link href="/dashboard/profile">
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                <User className="w-5 h-5 text-pink-600" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export { Header }
