import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Notification {
  id: string
  user_id: string
  type: 'new_review' | 'urgent_batch' | 'system'
  title: string
  message?: string
  data?: Record<string, any>
  is_read: boolean
  created_at: string
}

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/notifications?userId=${userId}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await fetch(`/api/notifications/${notificationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_read: true }),
        })
        fetchNotifications()
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    },
    [fetchNotifications]
  )

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await fetch(`/api/notifications/${notificationId}`, {
          method: 'DELETE',
        })
        fetchNotifications()
      } catch (error) {
        console.error('Error deleting notification:', error)
      }
    },
    [fetchNotifications]
  )

  const createNotification = useCallback(
    async (type: string, title: string, message?: string, data?: any) => {
      if (!userId) return

      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            type,
            title,
            message,
            data,
          }),
        })
        fetchNotifications()
      } catch (error) {
        console.error('Error creating notification:', error)
      }
    },
    [userId, fetchNotifications]
  )

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
    createNotification,
    refetch: fetchNotifications,
  }
}