import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getApiErrorDetail } from '@/lib/api-client'
import { useSubmitFeedback } from '@/hooks/use-feedback'
import { FEEDBACK_CATEGORY, FEEDBACK_CATEGORY_LABELS, type FeedbackCategory } from '@/types/api'

const INITIAL_FORM = {
  email: '',
  category: FEEDBACK_CATEGORY.GENERAL as FeedbackCategory,
  subject: '',
  message: '',
}

export function FeedbackSubmitDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState<string | null>(null)
  const submitFeedback = useSubmitFeedback()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setForm(INITIAL_FORM)
      setError(null)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!form.email.trim()) {
      setError('이메일을 입력해 주세요.')
      return
    }
    if (!form.subject.trim()) {
      setError('제목을 입력해 주세요.')
      return
    }
    if (!form.message.trim()) {
      setError('내용을 입력해 주세요.')
      return
    }

    submitFeedback.mutate(
      {
        email: form.email.trim(),
        category: form.category,
        subject: form.subject.trim(),
        message: form.message.trim(),
      },
      {
        onSuccess: () => {
          toast.success('피드백을 보내주셔서 감사합니다.')
          handleOpenChange(false)
        },
        onError: (err) => setError(getApiErrorDetail(err) ?? '피드백 전송에 실패했습니다.'),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          피드백 보내기
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>피드백 보내기</DialogTitle>
          <DialogDescription>
            버그, 제안, 의견 등 어떤 피드백이든 환영합니다. 답변은 입력하신 이메일로 전달됩니다.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="feedback-email">이메일</Label>
            <Input
              id="feedback-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="feedback-category">분류</Label>
            <Select
              value={form.category}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, category: value as FeedbackCategory }))
              }
            >
              <SelectTrigger id="feedback-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FEEDBACK_CATEGORY).map((category) => (
                  <SelectItem key={category} value={category}>
                    {FEEDBACK_CATEGORY_LABELS[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="feedback-subject">제목</Label>
            <Input
              id="feedback-subject"
              value={form.subject}
              onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="feedback-message">내용</Label>
            <Textarea
              id="feedback-message"
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              required
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="submit" disabled={submitFeedback.isPending}>
              {submitFeedback.isPending ? '전송 중...' : '보내기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
