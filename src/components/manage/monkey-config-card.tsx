import { useState, type FormEvent } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useGlobalControl, useUpdateGlobalControl } from '@/hooks/use-global-control'
import { getApiErrorDetail } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import type { GlobalMonkeyControl } from '@/types/api'

// kill_threshold is an earning ratio (-0.5 = -50%); show/edit it as a percentage.
const ratioToPercent = (ratio: number) => Math.round(ratio * 1000) / 10
const percentToRatio = (percent: number) => Math.round(percent * 10) / 1000

function buildForm(control: GlobalMonkeyControl) {
  return {
    starting_balance: String(control.auto_create_starting_balance),
    kill_threshold_pct: String(ratioToPercent(control.kill_threshold)),
    min_interval: String(control.auto_create_min_interval_seconds),
    max_interval: String(control.auto_create_max_interval_seconds),
  }
}

function ConfigForm({ control }: { control: GlobalMonkeyControl }) {
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
    const killPct = Number(form.kill_threshold_pct)
    const minInterval = Number(form.min_interval)
    const maxInterval = Number(form.max_interval)

    if (!Number.isInteger(startingBalance) || startingBalance < 1) {
      setError('기본 시작 자본금은 1원 이상의 정수여야 합니다.')
      return
    }
    if (!Number.isFinite(killPct)) {
      setError('폐사 기준 수익률을 올바르게 입력해 주세요.')
      return
    }
    if (
      !Number.isInteger(minInterval) ||
      !Number.isInteger(maxInterval) ||
      minInterval < 60 ||
      maxInterval > 1800
    ) {
      setError('거래 주기는 60~1800초 사이의 정수여야 합니다.')
      return
    }
    if (maxInterval < minInterval) {
      setError('최대 거래 주기는 최소 거래 주기 이상이어야 합니다.')
      return
    }

    updateControl.mutate(
      {
        auto_create_starting_balance: startingBalance,
        kill_threshold: percentToRatio(killPct),
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
        <Label htmlFor="config-kill-threshold">폐사 기준 수익률 (%)</Label>
        <Input
          id="config-kill-threshold"
          type="number"
          step="0.1"
          value={form.kill_threshold_pct}
          onChange={(event) => update('kill_threshold_pct', event.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          수익률이 이 값 아래로 떨어진 원숭이는 자동으로 폐사 처리됩니다. (예: -50)
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>거래 주기 범위 (초)</Label>
        <div className="flex items-center gap-2">
          <Input
            aria-label="최소 거래 주기"
            type="number"
            min={60}
            max={1800}
            value={form.min_interval}
            onChange={(event) => update('min_interval', event.target.value)}
            required
          />
          <span className="text-muted-foreground">~</span>
          <Input
            aria-label="최대 거래 주기"
            type="number"
            min={60}
            max={1800}
            value={form.max_interval}
            onChange={(event) => update('max_interval', event.target.value)}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          새 원숭이의 주문 주기는 이 범위(60~1800초) 안에서 무작위로 정해집니다.
        </p>
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
  const [open, setOpen] = useState(false)

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
            <Skeleton className="h-72 w-full" />
          ) : (
            // Re-seed the form from canonical server state whenever it changes.
            <ConfigForm key={data.updated_at} control={data} />
          )}
        </CardContent>
      ) : null}
    </Card>
  )
}
