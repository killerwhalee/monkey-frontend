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
  haste: '0.5',
  balls: '0.5',
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
    const haste = Number(form.haste)
    const balls = Number(form.balls)

    if (!form.name.trim()) {
      setError('이름을 입력해 주세요.')
      return
    }
    if (!Number.isFinite(initialBalance) || initialBalance < 0) {
      setError('초기 자본금은 0 이상의 숫자여야 합니다.')
      return
    }
    if (!Number.isFinite(haste) || haste < 0 || haste > 1) {
      setError('성급함은 0~1 사이의 값이어야 합니다.')
      return
    }
    if (!Number.isFinite(balls) || balls < 0 || balls > 1) {
      setError('배짱은 0~1 사이의 값이어야 합니다.')
      return
    }

    createMonkey.mutate(
      {
        name: form.name.trim(),
        is_active: true,
        balance: initialBalance,
        initial_balance: initialBalance,
        haste,
        balls,
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
            <Label htmlFor="monkey-haste">성급함 (0~1)</Label>
            <Input
              id="monkey-haste"
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={form.haste}
              onChange={(event) => setForm((prev) => ({ ...prev, haste: event.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              높을수록 거래 주기가 짧아져 자주 거래합니다.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="monkey-balls">배짱 (0~1)</Label>
            <Input
              id="monkey-balls"
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={form.balls}
              onChange={(event) => setForm((prev) => ({ ...prev, balls: event.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              높을수록 한 번에 더 많은 수량을 주문합니다.
            </p>
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
