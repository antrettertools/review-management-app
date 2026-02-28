'use client'

import { useSession } from 'next-auth/react'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsPage() {
  const { data: session } = useSession()
  const { notifications, loading, markAsRead, deleteNotification } =
    useNotifications((session?.user as any)?.id)

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_review':
        return 'bg-blue-50 border-blue-200'
      case 'urgent_batch':
        return 'bg-red-50 border-red-200'
      case 'system':
        return 'bg-slate-50 border-slate-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Notifications</h1>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No notifications yet
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card border ${getNotificationColor(
                notification.type
              )}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {notification.title}
                  </h3>

                  {notification.message && (
                    <p className="text-slate-700 mt-1">{notification.message}</p>
                  )}

                  <p className="text-xs text-slate-500 mt-2">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm px-3 py-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-sm px-3 py-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}