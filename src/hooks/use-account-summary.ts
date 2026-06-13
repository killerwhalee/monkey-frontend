import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { AccountSummary } from '@/types/api'

export function useAccountSummary() {
  return useQuery({
    queryKey: ['account-summary'],
    queryFn: () => api.get<AccountSummary>('/account-summary/'),
    refetchInterval: 60_000,
  })
}
