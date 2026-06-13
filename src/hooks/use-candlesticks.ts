import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Candlestick, CandleUnit } from '@/types/api'

export function useCandlesticks(unit: CandleUnit) {
  return useQuery({
    queryKey: ['candlesticks', unit],
    queryFn: () =>
      api.get<Candlestick[]>(`/candlesticks/?unit=${unit}`, { skipAuth: true }),
    refetchInterval: 60_000,
  })
}
