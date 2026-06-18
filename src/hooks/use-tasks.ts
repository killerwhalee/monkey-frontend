import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { taskEvents, type TaskEventDetail } from '@/lib/realtime'
import type {
  IntervalSchedule,
  RunnableTask,
  RunTaskResponse,
  TaskSchedule,
  UpdateIntervalPayload,
  UpdateSchedulePayload,
} from '@/types/api'

const TASKS_KEY = ['global-monkey-control', 'tasks']
const SCHEDULES_KEY = ['global-monkey-control', 'schedules']
const INTERVALS_KEY = ['global-monkey-control', 'interval-schedules']

export function useRunnableTasks() {
  return useQuery({
    queryKey: TASKS_KEY,
    queryFn: () => api.get<RunnableTask[]>('/global-monkey-control/tasks/'),
  })
}

export function useRunTask() {
  return useMutation({
    mutationFn: (task: string) =>
      api.post<RunTaskResponse>('/global-monkey-control/run-task/', { task }),
  })
}

/**
 * Tracks which Celery tasks are currently running, driven by the admin
 * WebSocket (task.started / task.finished). Buttons disable on enqueue and
 * re-enable when the matching finish event arrives. Keyed by the full Celery
 * task path so multiple runnable entries for the same task stay in sync.
 */
export function useRunningTasks() {
  // Map of Celery task id -> task path for in-flight runs.
  const [running, setRunning] = useState<Record<string, string>>({})

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<TaskEventDetail>).detail
      if (!detail) return
      if (detail.event === 'task.finished') {
        setRunning((prev) => {
          if (!(detail.id in prev)) return prev
          const next = { ...prev }
          delete next[detail.id]
          return next
        })
      } else if (detail.event === 'task.started') {
        setRunning((prev) => ({ ...prev, [detail.id]: detail.task }))
      }
    }
    taskEvents.addEventListener('task', handler)
    return () => taskEvents.removeEventListener('task', handler)
  }, [])

  const markRunning = useCallback((id: string, taskPath: string) => {
    setRunning((prev) => ({ ...prev, [id]: taskPath }))
  }, [])

  const runningPaths = new Set(Object.values(running))
  const isRunning = useCallback(
    (taskPath: string) => runningPaths.has(taskPath),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [running],
  )

  return { isRunning, markRunning }
}

export function useTaskSchedules() {
  return useQuery({
    queryKey: SCHEDULES_KEY,
    queryFn: () => api.get<TaskSchedule[]>('/global-monkey-control/schedules/'),
  })
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateSchedulePayload) =>
      api.post<TaskSchedule>('/global-monkey-control/update-schedule/', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_KEY })
    },
  })
}

export function useIntervalSchedules() {
  return useQuery({
    queryKey: INTERVALS_KEY,
    queryFn: () => api.get<IntervalSchedule[]>('/global-monkey-control/interval-schedules/'),
  })
}

export function useUpdateInterval() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateIntervalPayload) =>
      api.post<IntervalSchedule>('/global-monkey-control/update-interval/', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVALS_KEY })
    },
  })
}
