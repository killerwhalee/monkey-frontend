import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Order, Paginated } from '@/types/api'

// How many of a monkey's newest orders the public detail dialog shows.
const RECENT_ORDER_COUNT = 10

// The Order ledger is paginated server-side (DRF PageNumberPagination). A single
// monkey's history is bounded, so for the audit dialog we page through all pages
// and concatenate rather than truncating at the first page. Sent with auth so
// staff get the unredacted KIS payloads (the API masks account fields otherwise).
async function fetchAllMonkeyOrders(monkeyId: number): Promise<Order[]> {
  const orders: Order[] = []
  let page = 1
  for (;;) {
    const data = await api.get<Paginated<Order>>(`/orders/?monkey=${monkeyId}&page=${page}`)
    orders.push(...data.results)
    if (!data.next) break
    page += 1
  }
  return orders
}

export function useMonkeyOrders(monkeyId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ['orders', { monkey: monkeyId }],
    queryFn: () => fetchAllMonkeyOrders(monkeyId as number),
    enabled: enabled && monkeyId !== null,
  })
}

// Newest orders for the public detail dialog — fetched on open rather than
// embedded in every row of the monkey list, which made that list slow.
export function useRecentMonkeyOrders(monkeyId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ['orders', { monkey: monkeyId, recent: RECENT_ORDER_COUNT }],
    queryFn: async () => {
      const data = await api.get<Paginated<Order>>(
        `/orders/?monkey=${monkeyId}&page_size=${RECENT_ORDER_COUNT}`,
        { skipAuth: true },
      )
      return data.results
    },
    enabled: enabled && monkeyId !== null,
  })
}
