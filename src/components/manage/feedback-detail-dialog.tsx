import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useReplyFeedback } from '@/hooks/use-feedback'
import { getApiErrorDetail } from '@/lib/api-client'
import { formatDateTime } from '@/lib/format'
import type { Feedback } from '@/types/api'

interface FeedbackDetailDialogProps {
  feedback: Feedback | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDetailDialog({ feedback, open, onOpenChange }: FeedbackDetailDialogProps) {
  const [replyMessage, setReplyMessage] = useState('')
  const [lastFeedbackId, setLastFeedbackId] = useState<number | undefined>(feedback?.id)
  const replyFeedback = useReplyFeedback()

  if (feedback?.id !== lastFeedbackId) {
    setLastFeedbackId(feedback?.id)
    setReplyMessage('')
  }

  function handleReply() {
    if (!feedback) return
    if (!replyMessage.trim()) {
      toast.error('답변 내용을 입력해 주세요.')
      return
    }

    replyFeedback.mutate(
      { id: feedback.id, reply_message: replyMessage.trim() },
      {
        onSuccess: () => {
          toast.success('답변을 전송했습니다.')
          onOpenChange(false)
        },
        onError: (error) => toast.error(getApiErrorDetail(error) ?? '답변 전송에 실패했습니다.'),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {feedback ? (
          <>
            <DialogHeader>
              <DialogTitle>{feedback.subject}</DialogTitle>
              <DialogDescription>
                {feedback.email} · {formatDateTime(feedback.created_at)}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2">
              <Badge variant="outline">{feedback.category_label}</Badge>
              <Badge variant={feedback.status === 'new' ? 'default' : 'secondary'}>
                {feedback.status_label}
              </Badge>
            </div>

            <p className="whitespace-pre-wrap text-sm">{feedback.message}</p>

            {feedback.status === 'answered' ? (
              <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-sm font-medium">답변</p>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {feedback.reply_message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {feedback.replied_by_username} ·{' '}
                  {feedback.replied_at ? formatDateTime(feedback.replied_at) : ''}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="feedback-reply">답변 작성</Label>
                <Textarea
                  id="feedback-reply"
                  value={replyMessage}
                  onChange={(event) => setReplyMessage(event.target.value)}
                />
              </div>
            )}

            {feedback.status === 'new' ? (
              <DialogFooter>
                <Button onClick={handleReply} disabled={replyFeedback.isPending}>
                  {replyFeedback.isPending ? '전송 중...' : '답변 보내기'}
                </Button>
              </DialogFooter>
            ) : null}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
