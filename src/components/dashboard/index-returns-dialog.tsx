import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useIndexReturns } from '@/hooks/use-index-returns'
import { formatIndex, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { IndexReturns } from '@/types/api'

interface IndexReturnsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ROWS: { key: keyof IndexReturns['periods']; label: string }[] = [
  { key: 'day', label: '전일' },
  { key: 'week', label: '1주 전' },
  { key: 'month', label: '1개월 전' },
  { key: 'quarter', label: '1분기 전' },
]

export function IndexReturnsDialog({ open, onOpenChange }: IndexReturnsDialogProps) {
  const { data, isPending, isError } = useIndexReturns(open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>원숭이 지수 수익률</DialogTitle>
          <DialogDescription>기간별 기준일·지수와 등락률입니다.</DialogDescription>
        </DialogHeader>

        {isError ? (
          <p className="py-10 text-center text-sm text-destructive">
            수익률을 불러오지 못했습니다.
          </p>
        ) : isPending || !data ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">현재 지수</span>
              <span className="font-mono text-lg font-semibold tabular-nums">
                {formatIndex(data.current)}
              </span>
            </div>
            <dl className="flex flex-col divide-y divide-border/60">
              {ROWS.map(({ key, label }) => {
                const period = data.periods[key]
                const hasRate = period?.rate != null
                return (
                  <div key={key} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="flex flex-col">
                      <dt className="text-sm">{label}</dt>
                      {period ? (
                        <span className="text-xs text-muted-foreground">
                          {period.date} · {formatIndex(period.index)}
                        </span>
                      ) : null}
                    </div>
                    <dd
                      className={cn(
                        'font-mono text-sm tabular-nums',
                        hasRate ? signColorClass(period.rate as number) : 'text-muted-foreground',
                      )}
                    >
                      {hasRate ? formatPercent(period.rate as number) : '데이터 없음'}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
