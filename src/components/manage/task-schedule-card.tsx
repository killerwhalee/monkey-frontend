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
import { useTaskSchedules, useUpdateSchedule } from '@/hooks/use-tasks'
import { getApiErrorDetail } from '@/lib/api-client'
import type { TaskSchedule } from '@/types/api'

const pad = (value: number) => String(value).padStart(2, '0')
const formatTime = (schedule: TaskSchedule) => `${pad(schedule.hour)}:${pad(schedule.minute)}`

export function TaskScheduleCard() {
  const { data: schedules, isPending } = useTaskSchedules()
  const updateSchedule = useUpdateSchedule()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState('')

  if (isPending || !schedules) {
    return <Skeleton className="h-64 w-full" />
  }

  function startEdit(schedule: TaskSchedule) {
    setEditingId(schedule.id)
    setDraft(formatTime(schedule))
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft('')
  }

  function saveEdit(schedule: TaskSchedule) {
    const [hourStr, minuteStr] = draft.split(':')
    const hour = Number(hourStr)
    const minute = Number(minuteStr)
    if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
      toast.error('시각을 올바르게 입력해 주세요.')
      return
    }
    updateSchedule.mutate(
      { id: schedule.id, hour, minute },
      {
        onSuccess: () => {
          toast.success(`'${schedule.label}' 예약 시각을 ${formatTime({ ...schedule, hour, minute })}로 변경했습니다.`)
          cancelEdit()
        },
        onError: (error) => toast.error(getApiErrorDetail(error) ?? '예약 시각 변경에 실패했습니다.'),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>예약 스케줄</CardTitle>
        <CardDescription>
          매일 정해진 시각(KST)에 자동 실행되는 작업입니다. 시각을 변경하면 가까운 시각 순으로
          정렬됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>작업</TableHead>
              <TableHead className="w-40">예약 시각</TableHead>
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
                          type="time"
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          className="h-8 w-28 font-mono tabular-nums"
                          autoFocus
                        />
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="저장"
                          disabled={updateSchedule.isPending}
                          onClick={() => saveEdit(schedule)}
                        >
                          <CheckIcon />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="취소"
                          disabled={updateSchedule.isPending}
                          onClick={cancelEdit}
                        >
                          <XIcon />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums">{formatTime(schedule)}</span>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="시각 변경"
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
