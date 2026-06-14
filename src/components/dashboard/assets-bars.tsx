import { formatCurrency } from '@/lib/format'

interface AssetsBarsProps {
  initialBalance: number
  cashBalance: number
  holdingsValue: number
}

export function AssetsBars({ initialBalance, cashBalance, holdingsValue }: AssetsBarsProps) {
  const current = cashBalance + holdingsValue
  const max = Math.max(initialBalance, current, 1)
  const initialWidth = (initialBalance / max) * 100
  const currentWidth = (current / max) * 100
  const cashShare = current > 0 ? (cashBalance / current) * 100 : 0
  const holdingsShare = current > 0 ? (holdingsValue / current) * 100 : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">초기 자본금</span>
          <span className="font-mono tabular-nums">{formatCurrency(initialBalance)}</span>
        </div>
        <div className="h-5 w-full overflow-hidden rounded-md bg-muted/40">
          <div
            className="h-full rounded-md bg-muted-foreground/40"
            style={{ width: `${initialWidth}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">현재 평가자산</span>
          <span className="font-mono tabular-nums">{formatCurrency(current)}</span>
        </div>
        <div className="h-5 w-full overflow-hidden rounded-md bg-muted/40">
          <div className="flex h-full" style={{ width: `${currentWidth}%` }}>
            <div
              className="h-full bg-[var(--chart-1)]"
              style={{ width: `${cashShare}%` }}
            />
            <div
              className="h-full bg-[var(--chart-4)]"
              style={{ width: `${holdingsShare}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-[var(--chart-1)]" />
            현금 {formatCurrency(cashBalance)} ({Math.round(cashShare)}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-[var(--chart-4)]" />
            보유 종목 {formatCurrency(holdingsValue)} ({Math.round(holdingsShare)}%)
          </span>
        </div>
      </div>
    </div>
  )
}
