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
import { useCreateMonkey } from '@/hooks/use-monkeys'

const INITIAL_FORM = {
  name: '',
  initial_balance: '1000000',
  order_interval_seconds: '300',
}

export function MonkeyCreateDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState<string | null>(null)
  const createMonkey = useCreateMonkey()

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

    const initialBalance = Number(form.initial_balance)
    const orderIntervalSeconds = Number(form.order_interval_seconds)

    if (!form.name.trim()) {
      setError('이름을 입력해 주세요.')
      return
    }
    if (!Number.isFinite(initialBalance) || initialBalance < 0) {
      setError('초기 자본금은 0 이상의 숫자여야 합니다.')
      return
    }
    if (
      !Number.isInteger(orderIntervalSeconds) ||
      orderIntervalSeconds < 60 ||
      orderIntervalSeconds > 1800
    ) {
      setError('거래 주기는 60~1800 사이의 정수(초)여야 합니다.')
      return
    }

    createMonkey.mutate(
      {
        name: form.name.trim(),
        is_active: true,
        balance: initialBalance,
        initial_balance: initialBalance,
        order_interval_seconds: orderIntervalSeconds,
      },
      {
        onSuccess: () => {
          toast.success(`'${form.name.trim()}' 원숭이를 생성했습니다.`)
          handleOpenChange(false)
        },
        onError: () => setError('입력값을 확인해 주세요. 생성에 실패했습니다.'),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>원숭이 추가</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 원숭이 추가</DialogTitle>
          <DialogDescription>새로운 원숭이 트레이더를 한 마리 생성합니다.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="monkey-name">이름</Label>
            <Input
              id="monkey-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="monkey-balance">초기 자본금 (KRW)</Label>
            <Input
              id="monkey-balance"
              type="number"
              min={0}
              value={form.initial_balance}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, initial_balance: event.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="monkey-order-interval">거래 주기 (초)</Label>
            <Input
              id="monkey-order-interval"
              type="number"
              min={60}
              max={1800}
              value={form.order_interval_seconds}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, order_interval_seconds: event.target.value }))
              }
              required
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="submit" disabled={createMonkey.isPending}>
              {createMonkey.isPending ? '생성 중...' : '생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
