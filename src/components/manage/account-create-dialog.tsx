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
import { useCreateAccount } from '@/hooks/use-accounts'
import { getApiErrorDetail } from '@/lib/api-client'
import type { AccountType } from '@/types/api'

const EMPTY_FORM = {
  account_type: 'mock' as AccountType,
  app_key: '',
  app_secret: '',
  account_number: '',
  product_code: '01',
}

export function AccountCreateDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const createAccount = useCreateAccount()

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setForm(EMPTY_FORM)
      setError(null)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!/^\d{8}$/.test(form.account_number)) {
      setError('계좌번호(CANO)는 하이픈 없는 8자리 숫자여야 합니다.')
      return
    }
    createAccount.mutate(form, {
      onSuccess: () => {
        toast.success('계좌를 등록했습니다.')
        handleOpenChange(false)
      },
      onError: (err) => setError(getApiErrorDetail(err) ?? '계좌 등록에 실패했습니다.'),
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>계좌 추가</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 계좌 등록</DialogTitle>
          <DialogDescription>
            KIS 앱 키/시크릿을 등록합니다. 앱 키/시크릿은 암호화되어 저장되며, 등록 후에는 다시
            표시되지 않습니다.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="acct-type">유형</Label>
            <select
              id="acct-type"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              value={form.account_type}
              onChange={(event) => update('account_type', event.target.value as AccountType)}
            >
              <option value="mock">모의투자 (원숭이 거래)</option>
              <option value="real">실전투자 (시세 조회 전용)</option>
            </select>
            <p className="text-xs text-muted-foreground">
              원숭이는 모의투자 계좌에만 배정됩니다. 실전투자 계좌는 시세 조회 속도(18req/s)에만
              사용됩니다.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acct-cano">계좌번호 (CANO)</Label>
              <Input
                id="acct-cano"
                value={form.account_number}
                onChange={(event) => update('account_number', event.target.value)}
                placeholder="50331234"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acct-prdt">상품코드</Label>
              <Input
                id="acct-prdt"
                value={form.product_code}
                onChange={(event) => update('product_code', event.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="acct-key">App Key</Label>
            <Input
              id="acct-key"
              value={form.app_key}
              onChange={(event) => update('app_key', event.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="acct-secret">App Secret</Label>
            <Input
              id="acct-secret"
              value={form.app_secret}
              onChange={(event) => update('app_secret', event.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="submit" disabled={createAccount.isPending}>
              {createAccount.isPending ? '등록 중...' : '등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
