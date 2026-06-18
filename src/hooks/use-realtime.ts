import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getAccessToken } from '@/lib/auth'
import {
  createReconnectingSocket,
  taskEvents,
  wsUrl,
  type RealtimeMessage,
  type TaskEventDetail,
} from '@/lib/realtime'

/**
 * Opens the live-data WebSockets and patches the React Query cache on push.
 * The public dashboard socket runs for everyone; the admin socket (task
 * lifecycle) runs only for staff. Mount once near the app root.
 */
export function useRealtime(isAdmin: boolean) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = createReconnectingSocket(wsUrl('/ws/dashboard/'), (msg: RealtimeMessage) => {
      switch (msg.event) {
        case 'order.succeeded':
          void queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] })
          void queryClient.invalidateQueries({ queryKey: ['orders'] })
          break
        case 'index.tick':
          void queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] })
          void queryClient.invalidateQueries({ queryKey: ['index-returns'] })
          void queryClient.invalidateQueries({ queryKey: ['candlesticks'] })
          break
        case 'monkey.updated':
          void queryClient.invalidateQueries({ queryKey: ['monkeys'] })
          void queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] })
          break
      }
    })
    return () => socket.close()
  }, [queryClient])

  useEffect(() => {
    if (!isAdmin) return
    const socket = createReconnectingSocket(
      wsUrl('/ws/admin/', getAccessToken()),
      (msg: RealtimeMessage) => {
        taskEvents.dispatchEvent(
          new CustomEvent<TaskEventDetail>('task', { detail: msg as unknown as TaskEventDetail }),
        )
      },
    )
    return () => socket.close()
  }, [isAdmin])
}
