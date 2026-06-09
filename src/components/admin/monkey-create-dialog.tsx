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
  min_quantity: '1',
  max_quantity: '10',
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
    const minQuantity = Number(form.min_quantity)
    const maxQuantity = Number(form.max_quantity)

    if (!form.name.trim()) {
      setError('이름을 입력해 주세요.')
      return
    }
    if (!Number.isFinite(initialBalance) || initialBalance < 0) {
      setError('초기 자본금은 0 이상의 숫자여야 합니다.')
      return
    }
    if (!Number.isFinite(minQuantity) || minQuantity < 1) {
      setError('최소 매매 수량은 1 이상이어야 합니다.')
      return
    }
    if (!Number.isFinite(maxQuantity) || maxQuantity < minQuantity) {
      setError('최대 매매 수량은 최소 수량 이상이어야 합니다.')
      return
    }

    createMonkey.mutate(
      {
        name: form.name.trim(),
        is_active: true,
        balance: initialBalance,
        initial_balance: initialBalance,
        min_quantity: minQuantity,
        max_quantity: maxQuantity,
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="monkey-min-quantity">최소 매매 수량</Label>
              <Input
                id="monkey-min-quantity"
                type="number"
                min={1}
                value={form.min_quantity}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, min_quantity: event.target.value }))
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="monkey-max-quantity">최대 매매 수량</Label>
              <Input
                id="monkey-max-quantity"
                type="number"
                min={1}
                value={form.max_quantity}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, max_quantity: event.target.value }))
                }
                required
              />
            </div>
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
