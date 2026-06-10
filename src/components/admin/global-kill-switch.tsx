import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useGlobalControl, useUpdateGlobalControl } from '@/hooks/use-global-control'
import { formatDateTime } from '@/lib/format'

export function GlobalKillSwitch() {
  const { data, isPending } = useGlobalControl()
  const updateControl = useUpdateGlobalControl()

  if (isPending) {
    return <Skeleton className="h-32 w-full" />
  }

  const enabled = data?.enabled ?? false

  function handleToggle(next: boolean) {
    updateControl.mutate(
      { enabled: next },
      {
        onSuccess: () => {
          toast.success(next ? '전체 원숭이 거래를 활성화했습니다.' : '전체 원숭이 거래를 중단했습니다.')
        },
        onError: () => toast.error('설정 변경에 실패했습니다.'),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>전역 거래 스위치</CardTitle>
        <CardDescription>모든 원숭이의 거래 동작을 한 번에 켜거나 끄는 긴급 제어입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-4 ring-1 ring-foreground/5">
          <div className="flex items-center gap-3">
            <Switch
              checked={enabled}
              onCheckedChange={handleToggle}
              disabled={updateControl.isPending}
              aria-label="전역 거래 스위치"
            />
            <span className="text-sm font-medium">{enabled ? '거래 시작' : '거래 중단'}</span>
          </div>
          {data ? (
            <p className="text-xs text-muted-foreground">
              마지막 변경: {formatDateTime(data.updated_at)}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
