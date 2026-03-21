'use client'

import { useSession } from 'next-auth/react'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckCircle, Trash2, AlertTriangle, MessageSquare, Info } from 'lucide-react'

export default function NotificationsPage() {
  const { data: session } = useSession()
  const { notifications, loading, markAsRead, deleteNotification } =
    useNotifications((session?.user as any)?.id)

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'new_review':
        return { bg: 'bg-blue-50/50', border: 'border-blue-100', icon: MessageSquare, iconColor: 'text-blue-600', iconBg: 'bg-blue-100' }
      case 'urgent_batch':
        return { bg: 'bg-red-50/50', border: 'border-red-100', icon: AlertTriangle, iconColor: 'text-red-600', iconBg: 'bg-red-100' }
      case 'system':
        return { bg: 'bg-slate-50/50', border: 'border-slate-200/60', icon: Info, iconColor: 'text-slate-600', iconBg: 'bg-slate-100' }
      default:
        return { bg: 'bg-slate-50/50', border: 'border-slate-200/60', icon: Bell, iconColor: 'text-slate-600', iconBg: 'bg-slate-100' }
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-sm text-slate-400 mt-1">Stay up to date with your reviews</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading notifications...</p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-900 font-semibold">No notifications yet</p>
          <p className="text-sm text-slate-400 mt-1">You'll see new review alerts and updates here</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notification, index) => {
            const style = getNotificationStyle(notification.type)
            const Icon = style.icon
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border ${style.border} p-4 transition-all hover:shadow-sm animate-fade-in-up ${
                  !notification.is_read ? 'ring-1 ring-blue-100' : ''
                }`}
                style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 ${style.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={15} className={style.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className={`text-sm font-semibold text-slate-900 ${!notification.is_read ? '' : 'text-slate-700'}`}>
                          {notification.title}
                        </h3>
                        {notification.message && (
                          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{notification.message}</p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-[11px] px-2.5 py-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-semibold flex items-center gap-1"
                          >
                            <CheckCircle size={12} />
                            Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-[11px] px-2.5 py-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
