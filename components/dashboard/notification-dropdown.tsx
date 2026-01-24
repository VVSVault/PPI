'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell, Check, CheckCheck, Package, Wrench, Calendar, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  is_read: boolean
  created_at: string
}

const notificationIcons: Record<string, React.ReactNode> = {
  order_confirmed: <Package className="w-4 h-4 text-blue-500" />,
  order_scheduled: <Calendar className="w-4 h-4 text-purple-500" />,
  order_in_progress: <Package className="w-4 h-4 text-orange-500" />,
  order_completed: <Check className="w-4 h-4 text-green-500" />,
  order_cancelled: <Package className="w-4 h-4 text-red-500" />,
  service_request_acknowledged: <Wrench className="w-4 h-4 text-blue-500" />,
  service_request_scheduled: <Calendar className="w-4 h-4 text-purple-500" />,
  service_request_completed: <Wrench className="w-4 h-4 text-green-500" />,
  removal_reminder: <Calendar className="w-4 h-4 text-orange-500" />,
  welcome: <PartyPopper className="w-4 h-4 text-pink-500" />,
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications?limit=10')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unread_count)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  async function markAsRead(notificationIds: string[]) {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_ids: notificationIds }),
      })

      setNotifications((prev) =>
        prev.map((n) =>
          notificationIds.includes(n.id) ? { ...n, is_read: true } : n
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - notificationIds.length))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  async function markAllAsRead() {
    setLoading(true)
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_all_read: true }),
      })

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleNotificationClick(notification: Notification) {
    if (!notification.is_read) {
      markAsRead([notification.id])
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[8px] h-2 px-0.5 bg-pink-500 rounded-full text-[10px] text-white flex items-center justify-center">
            {unreadCount > 9 ? '' : ''}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => {
                  const content = (
                    <div
                      className={cn(
                        'px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer',
                        !notification.is_read && 'bg-pink-50/50'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {notificationIcons[notification.type] || (
                              <Bell className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                'text-sm',
                                notification.is_read
                                  ? 'text-gray-600'
                                  : 'text-gray-900 font-medium'
                              )}
                            >
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <span className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )

                  if (notification.link) {
                    return (
                      <Link
                        key={notification.id}
                        href={notification.link}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {content}
                      </Link>
                    )
                  }

                  return <div key={notification.id}>{content}</div>
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-center text-gray-500">
                Showing latest {notifications.length} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
