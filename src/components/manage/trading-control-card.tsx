import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfigValue } from '@/components/ui/config-value'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useGlobalControl, useUpdateGlobalControl } from '@/hooks/use-global-control'
import { useMarketHours } from '@/hooks/use-market-hours'
import { formatHourMinute } from '@/lib/format'
import { cn } from '@/lib/utils'

function GateBadge({ open }: { open: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        open
          ? 'border-positive/30 bg-positive/10 text-positive'
          : 'border-destructive/30 bg-destructive/10 text-destructive',
      )}
    >
      {open ? '열림' : '닫힘'}
    </Badge>
  )
}

function GateRow({
  title,
  description,
  children,
}: {
  title: string
  description: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/40 p-4 ring-1 ring-foreground/5">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function TradingControlCard() {
  const { data, isPending } = useGlobalControl()
  const { data: marketHours } = useMarketHours()
  const updateControl = useUpdateGlobalControl()

  if (isPending || !data) {
    return <Skeleton className="h-72 w-full" />
  }

  const openTime = formatHourMinute(marketHours?.open, '09:00')
  const closeTime = formatHourMinute(marketHours?.close, '15:30')

  function handleManualToggle(next: boolean) {
    updateControl.mutate(
      { manual_enabled: next },
      {
        onSuccess: () => {
          toast.success(next ? '수동 거래 스위치를 켰습니다.' : '수동 거래 스위치를 껐습니다.')
        },
        onError: () => toast.error('설정 변경에 실패했습니다.'),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>거래 제어</CardTitle>
        <CardDescription>
          세 개의 게이트가 모두 열려 있을 때만 전체 원숭이 거래가 실행됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div
          className={cn(
            'flex items-center justify-between gap-4 rounded-lg p-4 ring-1',
            data.enabled
              ? 'bg-positive/10 ring-positive/20'
              : 'bg-destructive/10 ring-destructive/20',
          )}
        >
          <div>
            <p className="text-sm font-medium">전역 거래 상태</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              시간 · 휴장일 · 수동 게이트의 논리곱으로 결정됩니다.
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              data.enabled
                ? 'border-positive/30 bg-positive/10 text-positive'
                : 'border-destructive/30 bg-destructive/10 text-destructive',
            )}
          >
            {data.enabled ? '거래 활성화' : '거래 중단됨'}
          </Badge>
        </div>

        <GateRow
          title="시간 게이트"
          description={
            <>
              평일 <ConfigValue>{openTime}</ConfigValue> 개장 /{' '}
              <ConfigValue>{closeTime}</ConfigValue> 마감, 주기 작업으로 자동
              제어됩니다.
            </>
          }
        >
          <GateBadge open={data.time_enabled} />
        </GateRow>

        <GateRow
          title="휴장일 게이트"
          description="매일 한국투자증권 휴장일 API로 개장일 여부를 확인합니다."
        >
          <GateBadge open={data.holiday_enabled} />
        </GateRow>

        <GateRow
          title="수동 스위치"
          description="관리자가 직접 켜고 끄는 긴급 제어 스위치입니다."
        >
          <div className="flex items-center gap-2">
            <Switch
              checked={data.manual_enabled}
              onCheckedChange={handleManualToggle}
              disabled={updateControl.isPending}
              aria-label="수동 거래 스위치"
            />
            <GateBadge open={data.manual_enabled} />
          </div>
        </GateRow>
      </CardContent>
    </Card>
  )
}
