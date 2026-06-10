import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Order } from '@/types/api'

export function useMonkeyOrders(monkeyId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ['orders', { monkey: monkeyId }],
    queryFn: () => api.get<Order[]>(`/orders/?monkey=${monkeyId}`, { skipAuth: true }),
    enabled: enabled && monkeyId !== null,
  })
}
