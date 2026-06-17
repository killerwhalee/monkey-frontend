import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { IndexReturns } from '@/types/api'

export function useIndexReturns(enabled: boolean) {
  return useQuery({
    queryKey: ['index-returns'],
    queryFn: () => api.get<IndexReturns>('/index-returns/', { skipAuth: true }),
    enabled,
    refetchInterval: 60_000,
  })
}
