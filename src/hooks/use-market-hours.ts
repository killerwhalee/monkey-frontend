import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { MarketHours } from '@/types/api'

const MARKET_HOURS_KEY = ['global-monkey-control', 'market-hours']

export function useMarketHours() {
  return useQuery({
    queryKey: MARKET_HOURS_KEY,
    queryFn: () => api.get<MarketHours>('/global-monkey-control/market-hours/'),
    staleTime: 5 * 60 * 1000,
  })
}
