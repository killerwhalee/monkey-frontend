import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Account, CreateAccountPayload } from '@/types/api'

const ACCOUNTS_KEY = ['accounts']

export function useAccounts() {
  return useQuery({
    queryKey: ACCOUNTS_KEY,
    queryFn: () => api.get<Account[]>('/accounts/'),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAccountPayload) => api.post<Account>('/accounts/', payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY })
      void queryClient.invalidateQueries({ queryKey: ['account-summary'] })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/accounts/${id}/`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY })
      void queryClient.invalidateQueries({ queryKey: ['account-summary'] })
      void queryClient.invalidateQueries({ queryKey: ['monkeys'] })
    },
  })
}
