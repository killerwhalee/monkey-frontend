import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Candlestick, CandleUnit } from '@/types/api'

const DEFAULT_LIMIT = 120

interface FetchOptions {
  before?: number
  limit?: number
}

/** Fetch one page of index candles. Pass `before` (a candle `time`) to page
 * backwards into older history. */
export function fetchCandlesticks(
  unit: CandleUnit,
  { before, limit = DEFAULT_LIMIT }: FetchOptions = {},
) {
  const params = new URLSearchParams({ unit, limit: String(limit) })
  if (before !== undefined) params.set('before', String(before))
  return api.get<Candlestick[]>(`/candlesticks/?${params.toString()}`, { skipAuth: true })
}

export function useCandlesticks(unit: CandleUnit) {
  return useQuery({
    queryKey: ['candlesticks', unit],
    queryFn: () => fetchCandlesticks(unit),
    refetchInterval: 60_000,
  })
}
