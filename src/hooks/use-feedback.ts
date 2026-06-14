import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Feedback, FeedbackCreatePayload, FeedbackReplyPayload } from '@/types/api'

const FEEDBACK_KEY = ['feedback']

export function useFeedbackList() {
  return useQuery({
    queryKey: FEEDBACK_KEY,
    queryFn: () => api.get<Feedback[]>('/feedback/'),
  })
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (payload: FeedbackCreatePayload) =>
      api.post<Feedback>('/feedback/', payload, { skipAuth: true }),
  })
}

interface ReplyFeedbackPayload extends FeedbackReplyPayload {
  id: number
}

export function useReplyFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: ReplyFeedbackPayload) =>
      api.post<Feedback>(`/feedback/${id}/reply/`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FEEDBACK_KEY })
    },
  })
}
