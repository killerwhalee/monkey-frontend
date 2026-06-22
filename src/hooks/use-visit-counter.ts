import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { VisitStats } from '@/types/api'

const VISIT_COUNTER_KEY = ['visits']

// Records this visit on mount and returns the today/total counts. The backend
// dedups per visitor per day, so refetches and refreshes never double-count —
// it's safe to fire the POST whenever the query mounts.
export function useVisitCounter() {
  return useQuery({
    queryKey: VISIT_COUNTER_KEY,
    queryFn: () => api.post<VisitStats>('/visits/', undefined, { skipAuth: true }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
