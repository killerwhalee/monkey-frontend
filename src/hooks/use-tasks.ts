import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
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
