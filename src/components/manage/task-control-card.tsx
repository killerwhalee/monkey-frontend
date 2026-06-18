import { useState } from 'react'
import { ChevronDownIcon, Loader2Icon, PlayIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useConfirm } from '@/hooks/use-confirm'
import { useGlobalControl } from '@/hooks/use-global-control'
import { useRunnableTasks, useRunningTasks, useRunTask } from '@/hooks/use-tasks'
import { getApiErrorDetail } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import type { RunnableTask } from '@/types/api'

function whenLabel(when: RunnableTask['when']) {
  if (when === 'market_open') return '장중 전용'
  if (when === 'market_closed') return '장 마감 후 전용'
  return null
}

function isBlocked(when: RunnableTask['when'], marketOpen: boolean) {
  if (when === 'market_open') return !marketOpen
  if (when === 'market_closed') return marketOpen
  return false
}

function TaskRow({
  task,
  onRun,
  isRunning,
  disabled,
  marketOpen,
}: {
  task: RunnableTask
  onRun: (task: RunnableTask) => void
  isRunning: boolean
  disabled: boolean
  marketOpen: boolean
}) {
  const blocked = isBlocked(task.when, marketOpen)
  const label = whenLabel(task.when)

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-muted/40 p-4 ring-1 ring-foreground/5">
      <div className="min-w-0">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-medium">{task.label}</span>
          <span className="font-mono text-xs text-muted-foreground">{task.task}</span>
          {label && (
            <Badge
              variant={blocked ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {label}
            </Badge>
          )}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
        {blocked && (
          <p className="mt-1 text-xs text-destructive">
            {task.when === 'market_open' ? '장이 열려 있을 때만 실행할 수 있습니다.' : '장이 닫혀 있을 때만 실행할 수 있습니다.'}
          </p>
        )}
      </div>
      <Button
        size="sm"
        variant={task.dangerous ? 'destructive' : 'outline'}
        className="shrink-0"
        disabled={disabled || blocked}
        onClick={() => onRun(task)}
      >
        {isRunning ? <Loader2Icon className="animate-spin" /> : <PlayIcon />}
        실행
      </Button>
    </div>
  )
}

export function TaskControlCard() {
  const { data: tasks, isPending: tasksPending } = useRunnableTasks()
  const { data: control, isPending: controlPending } = useGlobalControl()
  const runTask = useRunTask()
  const { isRunning, markRunning } = useRunningTasks()
  const confirm = useConfirm()
  const [open, setOpen] = useState(false)

  if (tasksPending || controlPending || !tasks || !control) {
    return <Skeleton className="h-72 w-full" />
  }

  const marketOpen = control.market_open
  const dangerous = tasks.filter((task) => task.dangerous)
  const safe = tasks.filter((task) => !task.dangerous)

  async function handleRun(task: RunnableTask) {
    if (task.dangerous) {
      const confirmed = await confirm({
        title: `'${task.label}' 실행`,
        description: '이 작업을 실행하면 다음이 발생합니다:',
        details: task.warnings,
        confirmLabel: '실행',
        variant: 'destructive',
      })
      if (!confirmed) return
    }
    runTask.mutate(task.name, {
      onSuccess: (data) => {
        // Keep the button disabled until the WS task.finished event clears it.
        markRunning(data.id, task.task)
        toast.success(`'${task.label}' 작업을 실행 요청했습니다.`)
      },
      onError: (error) =>
        toast.error(getApiErrorDetail(error) ?? `'${task.label}' 작업 실행에 실패했습니다.`),
    })
  }

  const renderRow = (task: RunnableTask) => {
    const enqueuing = runTask.isPending && runTask.variables === task.name
    const taskRunning = isRunning(task.task)
    return (
      <TaskRow
        key={task.name}
        task={task}
        onRun={handleRun}
        isRunning={enqueuing || taskRunning}
        disabled={enqueuing || taskRunning}
        marketOpen={marketOpen}
      />
    )
  }

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
            <CardTitle>작업 실행</CardTitle>
            <CardDescription>
              Celery 백그라운드 작업을 수동으로 한 번 실행합니다. 위험 작업은 실행 전 확인을
              거칩니다.
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
        <CardContent className="flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-muted-foreground">일반 작업</h3>
            {safe.map(renderRow)}
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-destructive">위험 작업</h3>
            {dangerous.map(renderRow)}
          </section>
        </CardContent>
      ) : null}
    </Card>
  )
}
