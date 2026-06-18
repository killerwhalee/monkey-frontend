import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { AccountCreateDialog } from '@/components/manage/account-create-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccounts, useDeleteAccount } from '@/hooks/use-accounts'
import { useConfirm } from '@/hooks/use-confirm'
import { getApiErrorDetail } from '@/lib/api-client'
import type { Account } from '@/types/api'

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
    </div>
  )
}

export function AccountsCard() {
  const { data: accounts, isPending } = useAccounts()

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>KIS 계좌</CardTitle>
          <CardDescription>
            KIS 앱 키/시크릿을 등록·관리합니다. 모의투자 계좌마다 원숭이와 보유 종목이 독립적으로
            운용됩니다.
          </CardDescription>
        </div>
        <div className="shrink-0">
          <AccountCreateDialog />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : accounts && accounts.length > 0 ? (
          accounts.map((account) => <AccountRow key={account.id} account={account} />)
        ) : (
          <p className="text-sm text-muted-foreground">등록된 계좌가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  )
}
