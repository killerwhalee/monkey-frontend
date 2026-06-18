import { useState, type FormEvent } from 'react'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from '@/hooks/use-accounts'
import { useConfirm } from '@/hooks/use-confirm'
import { getApiErrorDetail } from '@/lib/api-client'
import type { Account, AccountType } from '@/types/api'

const EMPTY_FORM = {
  account_type: 'mock' as AccountType,
  app_key: '',
  app_secret: '',
  account_number: '',
  product_code: '01',
}

function RegisterForm() {
  const createAccount = useCreateAccount()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
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
        setForm(EMPTY_FORM)
      },
      onError: (err) => setError(getApiErrorDetail(err) ?? '계좌 등록에 실패했습니다.'),
    })
  }

  return (
    <form className="flex flex-col gap-4 rounded-lg bg-muted/40 p-4 ring-1 ring-foreground/5" onSubmit={handleSubmit}>
      <p className="text-sm font-semibold">새 계좌 등록</p>
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
          원숭이는 모의투자 계좌에만 배정됩니다. 실전투자 계좌는 시세 조회 속도(18req/s)에만 사용됩니다.
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
          type="password"
          value={form.app_key}
          onChange={(event) => update('app_key', event.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="acct-secret">App Secret</Label>
        <Input
          id="acct-secret"
          type="password"
          value={form.app_secret}
          onChange={(event) => update('app_secret', event.target.value)}
          required
        />
      </div>
      <p className="text-xs text-muted-foreground">
        앱 키/시크릿은 암호화되어 저장되며, 등록 후에는 다시 표시되지 않습니다.
      </p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={createAccount.isPending}>
          {createAccount.isPending ? '등록 중...' : '등록'}
        </Button>
      </div>
    </form>
  )
}

function AccountConfig({ account }: { account: Account }) {
  const updateAccount = useUpdateAccount()
  const [form, setForm] = useState({
    starting: String(account.auto_create_starting_balance),
    min: String(account.auto_create_min_interval_seconds),
    max: String(account.auto_create_max_interval_seconds),
  })
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const starting = Number(form.starting)
    const min = Number(form.min)
    const max = Number(form.max)
    if (max < min) {
      setError('최대 거래 주기는 최소 거래 주기 이상이어야 합니다.')
      return
    }
    updateAccount.mutate(
      {
        id: account.id,
        auto_create_starting_balance: starting,
        auto_create_min_interval_seconds: min,
        auto_create_max_interval_seconds: max,
      },
      {
        onSuccess: () => toast.success('자동 생성 설정을 저장했습니다.'),
        onError: (err) => setError(getApiErrorDetail(err) ?? '설정 저장에 실패했습니다.'),
      },
    )
  }

  return (
    <form className="mt-3 flex flex-col gap-2 border-t border-border/50 pt-3" onSubmit={handleSubmit}>
      <p className="text-xs font-medium text-muted-foreground">자동 생성 설정</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <Input
          aria-label="시작 자본금"
          type="number"
          min={1}
          value={form.starting}
          onChange={(event) => setForm((prev) => ({ ...prev, starting: event.target.value }))}
        />
        <Input
          aria-label="최소 거래 주기"
          type="number"
          min={60}
          max={7200}
          value={form.min}
          onChange={(event) => setForm((prev) => ({ ...prev, min: event.target.value }))}
        />
        <Input
          aria-label="최대 거래 주기"
          type="number"
          min={60}
          max={7200}
          value={form.max}
          onChange={(event) => setForm((prev) => ({ ...prev, max: event.target.value }))}
        />
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" size="sm" variant="outline" disabled={updateAccount.isPending}>
          {updateAccount.isPending ? '저장 중...' : '설정 저장'}
        </Button>
      </div>
    </form>
  )
}

function AccountRow({ account }: { account: Account }) {
  const deleteAccount = useDeleteAccount()
  const confirm = useConfirm()

  async function handleDelete() {
    const confirmed = await confirm({
      title: `계좌 ${account.display_id} 삭제`,
      description: '이 계좌를 삭제하면 다음이 발생합니다:',
      details: [
        '앱 키/시크릿이 삭제되고 계좌가 비활성화됩니다.',
        '이 계좌의 원숭이가 모두 죽고(DEAD) 보유 종목이 삭제됩니다.',
        '주문 기록은 보존됩니다.',
      ],
      confirmLabel: '삭제',
      variant: 'destructive',
    })
    if (!confirmed) return
    deleteAccount.mutate(account.id, {
      onSuccess: () => toast.success(`계좌 ${account.display_id}를 삭제했습니다.`),
      onError: (err) => toast.error(getApiErrorDetail(err) ?? '계좌 삭제에 실패했습니다.'),
    })
  }

  return (
    <div className="rounded-lg bg-muted/40 p-4 ring-1 ring-foreground/5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-medium">{account.display_id}</span>
            <Badge variant={account.account_type === 'mock' ? 'secondary' : 'outline'}>
              {account.account_type === 'mock' ? '모의투자' : '실전투자'}
            </Badge>
            {!account.is_active && <Badge variant="destructive">비활성</Badge>}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            토큰 {account.token_status.has_token ? '발급됨' : '미발급'}
          </p>
        </div>
        <Button
          size="sm"
          variant="destructive"
          className="shrink-0"
          disabled={deleteAccount.isPending || !account.is_active}
          onClick={handleDelete}
        >
          <Trash2Icon />
          삭제
        </Button>
      </div>
      {account.is_active && account.account_type === 'mock' ? (
        <AccountConfig account={account} />
      ) : null}
    </div>
  )
}

export function AccountsCard() {
  const { data: accounts, isPending } = useAccounts()

  return (
    <Card>
      <CardHeader>
        <CardTitle>KIS 계좌</CardTitle>
        <CardDescription>
          KIS 앱 키/시크릿을 등록·관리합니다. 모의투자 계좌마다 원숭이와 보유 종목이 독립적으로 운용됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : accounts && accounts.length > 0 ? (
          accounts.map((account) => <AccountRow key={account.id} account={account} />)
        ) : (
          <p className="text-sm text-muted-foreground">등록된 계좌가 없습니다.</p>
        )}
        <RegisterForm />
      </CardContent>
    </Card>
  )
}
