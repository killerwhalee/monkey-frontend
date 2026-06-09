import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { KisAccessToken } from '@/types/api'

export function useKisTokens() {
  return useQuery({
    queryKey: ['kis-access-tokens'],
    queryFn: () => api.get<KisAccessToken[]>('/kis-access-tokens/'),
  })
}
