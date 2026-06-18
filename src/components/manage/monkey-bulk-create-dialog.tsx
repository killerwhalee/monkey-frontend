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
import { useAccounts } from '@/hooks/use-accounts'
import { useBulkCreateMonkeys } from '@/hooks/use-monkeys'

const INITIAL_FORM = {
  account: '',
  count: '10',
  starting_balance: '1000000',
}

export function MonkeyBulkCreateDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState<string | null>(null)
  const bulkCreateMonkeys = useBulkCreateMonkeys()
  const { data: accounts } = useAccounts()
  const mockAccounts = (accounts ?? []).filter(
    (account) => account.is_active && account.account_type === 'mock',
  )

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
    const accountId = Number(form.account)

    if (!accountId) {
      setError('계좌를 선택해 주세요.')
      return
    }
    if (!Number.isInteger(count) || count < 1 || count > 1000) {
      setError('생성 개수는 1~1000 사이의 정수여야 합니다.')
      return
    }
    if (!Number.isFinite(startingBalance) || startingBalance < 0) {
      setError('시작 자본금은 0 이상의 숫자여야 합니다.')
      return
    }

    bulkCreateMonkeys.mutate(
      {
        account: accountId,
        count,
        starting_balance: startingBalance,
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
            <Label htmlFor="bulk-account">계좌</Label>
            <select
              id="bulk-account"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              value={form.account}
              onChange={(event) => setForm((prev) => ({ ...prev, account: event.target.value }))}
              required
            >
              <option value="" disabled>
                계좌 선택
              </option>
              {mockAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.display_id}
                </option>
              ))}
            </select>
          </div>
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
