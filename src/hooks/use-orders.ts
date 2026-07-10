import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Order, Paginated } from '@/types/api'

// The Order ledger is paginated server-side (DRF PageNumberPagination). A single
// monkey's history is bounded, so for the audit dialog we page through all pages
// and concatenate rather than truncating at the first page.
async function fetchAllMonkeyOrders(monkeyId: number): Promise<Order[]> {
  const orders: Order[] = []
  let page = 1
  for (;;) {
    const data = await api.get<Paginated<Order>>(
      `/orders/?monkey=${monkeyId}&page=${page}`,
      { skipAuth: true },
    )
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
