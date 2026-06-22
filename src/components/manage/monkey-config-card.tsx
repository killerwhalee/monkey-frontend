import { useState, type FormEvent } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardSummary } from '@/hooks/use-dashboard-summary'
import { useGlobalControl, useUpdateGlobalControl } from '@/hooks/use-global-control'
import { getApiErrorDetail } from '@/lib/api-client'
import { avgKisInterval, formatCurrency, formatSeconds } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { GlobalMonkeyControl } from '@/types/api'

function buildForm(control: GlobalMonkeyControl) {
  return {
    starting_balance: String(control.auto_create_starting_balance),
    min_interval: String(control.auto_create_min_interval_seconds),
    max_interval: String(control.auto_create_max_interval_seconds),
  }
}

function IntervalHint({
  form,
  activeMonkeys: n,
}: {
  form: ReturnType<typeof buildForm>
  activeMonkeys: number
}) {
  const a = Number(form.min_interval)
  const b = Number(form.max_interval)
  const avgT = Number.isFinite(a) && Number.isFinite(b) ? avgKisInterval(n, a, b) : null

  return (
    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
      <p>
        원숭이의 거래 주기는 성급함에 따라{' '}
        <Badge variant="secondary">{a}초</Badge>~<Badge variant="secondary">{b}초</Badge> 안에서 정해집니다. 성급함이
        높을수록 최소값(빠름)에, 낮을수록 최대값(느림)에 가까워집니다.
      </p>
      {n > 0 && avgT !== null && Number.isFinite(avgT) && avgT > 0 ? (
        <p>
          현재 활성 원숭이 <Badge variant="secondary">{n}마리</Badge> 기준, KIS API 평균 호출
          간격은 약{' '}
          <Badge variant="secondary">{formatSeconds(avgT)}</Badge>입니다.
        </p>
      ) : n === 0 ? (
        <p>활성 원숭이가 없어 평균 호출 간격을 계산할 수 없습니다.</p>
      ) : null}
    </div>
  )
}

function ConfigForm({ control, activeMonkeys }: { control: GlobalMonkeyControl; activeMonkeys: number }) {
  const updateControl = useUpdateGlobalControl()
  const [form, setForm] = useState(() => buildForm(control))
  const [error, setError] = useState<string | null>(null)

  function update(field: keyof ReturnType<typeof buildForm>, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const startingBalance = Number(form.starting_balance)
    const minInterval = Number(form.min_interval)
    const maxInterval = Number(form.max_interval)

    if (!Number.isInteger(startingBalance) || startingBalance < 1) {
      setError('기본 시작 자본금은 1원 이상의 정수여야 합니다.')
      return
    }
    if (
      !Number.isInteger(minInterval) ||
      !Number.isInteger(maxInterval) ||
      minInterval < 60 ||
      maxInterval > 7200
    ) {
      setError('거래 주기는 60~7200초 사이의 정수여야 합니다.')
      return
    }
    if (maxInterval < minInterval) {
      setError('최대 거래 주기는 최소 거래 주기 이상이어야 합니다.')
      return
    }

    updateControl.mutate(
      {
        auto_create_starting_balance: startingBalance,
        auto_create_min_interval_seconds: minInterval,
        auto_create_max_interval_seconds: maxInterval,
      },
      {
        onSuccess: () => toast.success('원숭이 설정을 저장했습니다.'),
        onError: (err) => setError(getApiErrorDetail(err) ?? '설정 저장에 실패했습니다.'),
      },
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="config-starting-balance">기본 시작 자본금 (KRW)</Label>
        <Input
          id="config-starting-balance"
          type="number"
          min={1}
          value={form.starting_balance}
          onChange={(event) => update('starting_balance', event.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          자동 생성 시 미배정 잔고를 이 금액으로 나눠 마리 수를 정합니다.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>거래 주기 범위 (초)</Label>
        <div className="flex items-center gap-2">
          <Input
            aria-label="최소 거래 주기"
            type="number"
            min={60}
            max={7200}
            value={form.min_interval}
            onChange={(event) => update('min_interval', event.target.value)}
            required
          />
          <span className="text-muted-foreground">~</span>
          <Input
            aria-label="최대 거래 주기"
            type="number"
            min={60}
            max={7200}
            value={form.max_interval}
            onChange={(event) => update('max_interval', event.target.value)}
            required
          />
        </div>
        <IntervalHint form={form} activeMonkeys={activeMonkeys} />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={updateControl.isPending}>
          {updateControl.isPending ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  )
}

export function MonkeyConfigCard() {
  const { data, isPending } = useGlobalControl()
  const { data: summary } = useDashboardSummary()
  const [open, setOpen] = useState(false)

  const activeMonkeys = summary?.active_monkey_count ?? 0

  return (
    <Card>
      <CardHeader>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-2 text-left"
        >
          <div>
            <CardTitle>원숭이 설정</CardTitle>
            <CardDescription>
              새로 생성되는 원숭이에 적용되는 기본값입니다. 변경 후 생성된 원숭이부터 반영됩니다.
            </CardDescription>
            {data ? (
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="secondary">
                  {formatCurrency(data.auto_create_starting_balance)}
                </Badge>
                <Badge variant="secondary">
                  {formatSeconds(data.auto_create_min_interval_seconds)} ~{' '}
                  {formatSeconds(data.auto_create_max_interval_seconds)}
                </Badge>
              </div>
            ) : null}
          </div>
          <ChevronDownIcon
            className={cn(
              'mt-1 size-4 shrink-0 text-muted-foreground transition-transform',
              open && 'rotate-180',
            )}
          />
        </button>
      </CardHeader>
      {open ? (
        <CardContent>
          {isPending || !data ? (
            // Field-shaped placeholders for the form contents, not one big block.
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full" />
              </div>
              <Skeleton className="ml-auto h-9 w-20" />
            </div>
          ) : (
            // Re-seed the form from canonical server state whenever it changes.
            <ConfigForm key={data.updated_at} control={data} activeMonkeys={activeMonkeys} />
          )}
        </CardContent>
      ) : null}
    </Card>
  )
}
