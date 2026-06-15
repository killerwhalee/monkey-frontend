import { useState } from 'react'
import { CheckIcon, PencilIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIntervalSchedules, useUpdateInterval } from '@/hooks/use-tasks'
import { getApiErrorDetail } from '@/lib/api-client'
import type { IntervalSchedule } from '@/types/api'

export function IntervalScheduleCard() {
  const { data: schedules, isPending } = useIntervalSchedules()
  const updateInterval = useUpdateInterval()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState('')

  if (isPending || !schedules) {
    return <Skeleton className="h-56 w-full" />
  }

  function startEdit(schedule: IntervalSchedule) {
    setEditingId(schedule.id)
    setDraft(String(schedule.every))
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft('')
  }

  function saveEdit(schedule: IntervalSchedule) {
    const every = Number(draft)
    if (!Number.isInteger(every) || every < 5 || every > 3600) {
      toast.error('주기는 5~3600초 사이의 정수여야 합니다.')
      return
    }
    updateInterval.mutate(
      { id: schedule.id, every },
      {
        onSuccess: () => {
          toast.success(`'${schedule.label}' 실행 주기를 ${every}초로 변경했습니다.`)
          cancelEdit()
        },
        onError: (error) => toast.error(getApiErrorDetail(error) ?? '주기 변경에 실패했습니다.'),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>주기 작업</CardTitle>
        <CardDescription>
          일정 시간마다 반복 실행되는 작업입니다. 실행 주기(초)를 변경할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>작업</TableHead>
              <TableHead className="w-44">실행 주기</TableHead>
              <TableHead className="w-28 text-right">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => {
              const isEditing = editingId === schedule.id
              return (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-medium">{schedule.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {schedule.task}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{schedule.description}</p>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <Input
                          type="number"
                          min={5}
                          max={3600}
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          className="h-8 w-24 font-mono tabular-nums"
                          autoFocus
                        />
                        <span className="text-xs text-muted-foreground">초</span>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="저장"
                          disabled={updateInterval.isPending}
                          onClick={() => saveEdit(schedule)}
                        >
                          <CheckIcon />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="취소"
                          disabled={updateInterval.isPending}
                          onClick={cancelEdit}
                        >
                          <XIcon />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums">{schedule.every}초마다</span>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="주기 변경"
                          onClick={() => startEdit(schedule)}
                        >
                          <PencilIcon />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        schedule.enabled
                          ? 'border-positive/30 bg-positive/10 text-positive'
                          : 'border-muted-foreground/30 bg-muted text-muted-foreground'
                      }
                    >
                      {schedule.enabled ? '사용' : '중지'}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
