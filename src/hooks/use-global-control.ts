import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { GlobalMonkeyControl } from '@/types/api'

const GLOBAL_CONTROL_KEY = ['global-monkey-control', 'current']

export function useGlobalControl() {
  return useQuery({
    queryKey: GLOBAL_CONTROL_KEY,
    queryFn: () => api.get<GlobalMonkeyControl>('/global-monkey-control/current/'),
  })
}

export function useUpdateGlobalControl() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Pick<GlobalMonkeyControl, 'enabled' | 'note'>>) =>
      api.patch<GlobalMonkeyControl>('/global-monkey-control/current/', payload),
    onSuccess: (data) => {
      queryClient.setQueryData(GLOBAL_CONTROL_KEY, data)
    },
  })
}
