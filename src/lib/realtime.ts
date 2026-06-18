// WebSocket plumbing for live updates (orders, index, monkeys, admin tasks).
// Derives the WS endpoint from VITE_API_BASE_URL, reconnects with backoff, and
// exposes a small event target so the manage page can react to task lifecycle.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

/** Build the absolute ws(s):// URL for a backend WebSocket path (e.g. "/ws/dashboard/"). */
export function wsUrl(path: string, token?: string | null): string {
  let host: string
  let secure: boolean
  try {
    // Absolute API base (dev): borrow its host, drop the trailing "/api".
    const base = new URL(API_BASE_URL, window.location.origin)
    host = base.host
    secure = base.protocol === 'https:'
  } catch {
    host = window.location.host
    secure = window.location.protocol === 'https:'
  }
  const scheme = secure ? 'wss' : 'ws'
  const query = token ? `?token=${encodeURIComponent(token)}` : ''
  return `${scheme}://${host}${path}${query}`
}

export interface RealtimeMessage {
  event: string
  [key: string]: unknown
}

export interface ReconnectingSocket {
  close: () => void
}

/** Open a WebSocket that auto-reconnects with capped exponential backoff. */
export function createReconnectingSocket(
  url: string,
  onMessage: (message: RealtimeMessage) => void,
): ReconnectingSocket {
  let socket: WebSocket | null = null
  let closedByUs = false
  let retries = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const connect = () => {
    socket = new WebSocket(url)
    socket.onopen = () => {
      retries = 0
    }
    socket.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data) as RealtimeMessage)
      } catch {
        // Ignore non-JSON frames.
      }
    }
    socket.onclose = () => {
      if (closedByUs) return
      const delay = Math.min(1000 * 2 ** retries, 15_000)
      retries += 1
      timer = setTimeout(connect, delay)
    }
    // Let onclose drive reconnection.
    socket.onerror = () => socket?.close()
  }

  connect()

  return {
    close: () => {
      closedByUs = true
      if (timer) clearTimeout(timer)
      socket?.close()
    },
  }
}

// Admin task lifecycle events (task.started / task.finished) fan out here so the
// task-control card can enable/disable run buttons without prop drilling.
export const taskEvents = new EventTarget()

export interface TaskEventDetail {
  event: string // "task.started" | "task.finished"
  task: string
  id: string
  ok?: boolean | null
  error?: string | null
}
