import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Monkey, MonkeyBulkCreatePayload } from '@/types/api'

const MONKEYS_KEY = ['monkeys']

export function useMonkeys() {
  return useQuery({
    queryKey: MONKEYS_KEY,
    queryFn: () => api.get<Monkey[]>('/monkeys/'),
  })
}

interface CreateMonkeyPayload {
  name: string
  is_active: boolean
  balance: number
  initial_balance: number
  min_quantity: number
  max_quantity: number
}

export function useCreateMonkey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMonkeyPayload) => api.post<Monkey>('/monkeys/', payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MONKEYS_KEY })
    },
  })
}

export function useBulkCreateMonkeys() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: MonkeyBulkCreatePayload) =>
      api.post<Monkey[]>('/monkeys/bulk-create/', payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MONKEYS_KEY })
    },
  })
}

interface UpdateMonkeyPayload {
  id: number
  is_active?: boolean
  name?: string
  min_quantity?: number
  max_quantity?: number
}

export function useUpdateMonkey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateMonkeyPayload) =>
      api.patch<Monkey>(`/monkeys/${id}/`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MONKEYS_KEY })
    },
  })
}
