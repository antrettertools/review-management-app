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
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_review':
        return '📝'
      case 'urgent_batch':
        return '⚠️'
      case 'system':
        return 'ℹ️'
      default:
        return '📌'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notifications yet
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 ${getNotificationColor(
                notification.type
              )}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <h3 className="font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    {!notification.is_read && (
                      <span className="ml-auto px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  {notification.message && (
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                  )}

                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
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