import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useGlobalControl, useUpdateGlobalControl } from '@/hooks/use-global-control'
import { formatDateTime } from '@/lib/format'

export function GlobalKillSwitch() {
  const { data, isPending } = useGlobalControl()
  const updateControl = useUpdateGlobalControl()
  const [note, setNote] = useState('')
  const [noteDirty, setNoteDirty] = useState(false)
  const [syncedNote, setSyncedNote] = useState<string | null>(null)

  // Adjust local note state during render when the server value changes
  // (and the user hasn't started editing) — see "Adjusting state when a prop
  // changes" in the React docs; avoids an extra effect-driven render pass.
  if (data && data.note !== syncedNote && !noteDirty) {
    setSyncedNote(data.note)
    setNote(data.note)
  }

  if (isPending) {
    return <Skeleton className="h-44 w-full" />
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

  function handleNoteSave() {
    updateControl.mutate(
      { note },
      {
        onSuccess: () => {
          setNoteDirty(false)
          toast.success('메모를 저장했습니다.')
        },
        onError: () => toast.error('메모 저장에 실패했습니다.'),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>전역 거래 스위치</CardTitle>
        <CardDescription>모든 원숭이의 거래 동작을 한 번에 켜거나 끄는 긴급 제어입니다.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-4 ring-1 ring-foreground/5">
          <div className="flex gap-2">
            <Button
              variant={enabled ? 'default' : 'outline'}
              className={enabled ? 'bg-positive text-positive-foreground hover:bg-positive/90' : ''}
              onClick={() => handleToggle(true)}
              disabled={updateControl.isPending || enabled}
            >
              거래 시작
            </Button>
            <Button
              variant={!enabled ? 'destructive' : 'outline'}
              onClick={() => handleToggle(false)}
              disabled={updateControl.isPending || !enabled}
            >
              거래 중단
            </Button>
          </div>
          {data ? (
            <p className="text-xs text-muted-foreground">
              마지막 변경: {formatDateTime(data.updated_at)}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="global-control-note">메모</Label>
          <div className="flex gap-2">
            <Input
              id="global-control-note"
              value={note}
              onChange={(event) => {
                setNote(event.target.value)
                setNoteDirty(true)
              }}
              placeholder="이 설정에 대한 메모를 남겨보세요"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleNoteSave}
              disabled={!noteDirty || updateControl.isPending}
            >
              저장
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
