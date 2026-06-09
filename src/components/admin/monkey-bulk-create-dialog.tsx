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
import { useBulkCreateMonkeys } from '@/hooks/use-monkeys'

const INITIAL_FORM = {
  count: '10',
  starting_balance: '1000000',
  min_quantity: '1',
  max_quantity: '10',
}

export function MonkeyBulkCreateDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState<string | null>(null)
  const bulkCreateMonkeys = useBulkCreateMonkeys()

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

    const count = Number(form.count)
    const startingBalance = Number(form.starting_balance)
    const minQuantity = Number(form.min_quantity)
    const maxQuantity = Number(form.max_quantity)

    if (!Number.isInteger(count) || count < 1 || count > 1000) {
      setError('생성 개수는 1~1000 사이의 정수여야 합니다.')
      return
    }
    if (!Number.isFinite(startingBalance) || startingBalance < 0) {
      setError('시작 자본금은 0 이상의 숫자여야 합니다.')
      return
    }
    if (!Number.isInteger(minQuantity) || minQuantity < 1) {
      setError('최소 매매 수량은 1 이상의 정수여야 합니다.')
      return
    }
    if (!Number.isInteger(maxQuantity) || maxQuantity < minQuantity) {
      setError('최대 매매 수량은 최소 수량 이상의 정수여야 합니다.')
      return
    }

    bulkCreateMonkeys.mutate(
      {
        count,
        starting_balance: startingBalance,
        min_quantity: minQuantity,
        max_quantity: maxQuantity,
      },
      {
        onSuccess: (created) => {
          toast.success(`원숭이 ${created.length}마리를 생성했습니다.`)
          handleOpenChange(false)
        },
        onError: () => setError('입력값을 확인해 주세요. 생성에 실패했습니다.'),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">대량 생성</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>원숭이 대량 생성</DialogTitle>
          <DialogDescription>
            동일한 조건의 원숭이 트레이더를 한 번에 여러 마리 생성합니다.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bulk-count">생성 개수</Label>
            <Input
              id="bulk-count"
              type="number"
              min={1}
              max={1000}
              value={form.count}
              onChange={(event) => setForm((prev) => ({ ...prev, count: event.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bulk-starting-balance">시작 자본금 (KRW)</Label>
            <Input
              id="bulk-starting-balance"
              type="number"
              min={0}
              value={form.starting_balance}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, starting_balance: event.target.value }))
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bulk-min-quantity">최소 매매 수량</Label>
              <Input
                id="bulk-min-quantity"
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
              <Label htmlFor="bulk-max-quantity">최대 매매 수량</Label>
              <Input
                id="bulk-max-quantity"
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
            <Button type="submit" disabled={bulkCreateMonkeys.isPending}>
              {bulkCreateMonkeys.isPending ? '생성 중...' : '생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
