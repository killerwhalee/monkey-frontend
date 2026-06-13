import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccountSummary } from '@/hooks/use-account-summary'
import { formatCurrency, formatNumber, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'

function SummaryStat({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="rounded-lg bg-muted/40 p-3 ring-1 ring-foreground/5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('mt-1 font-mono text-sm font-medium tabular-nums', valueClassName)}>{value}</p>
    </div>
  )
}

export function AccountSummaryCard() {
  const { data, isPending, isError } = useAccountSummary()

  return (
    <Card>
      <CardHeader>
        <CardTitle>전체 계좌 현황</CardTitle>
        <CardDescription>실제 KIS 계좌와 전체 원숭이의 합산 운영 현황입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <p className="py-6 text-center text-sm text-destructive">
            계좌 현황을 불러오지 못했습니다.
          </p>
        ) : isPending || !data ? (
          <div className="grid gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-4">
            <SummaryStat label="KIS 예수금" value={formatCurrency(data.kis_cash_balance)} />
            <SummaryStat label="미할당 현금" value={formatCurrency(data.unallocated_cash)} />
            <SummaryStat label="전체 평가자산" value={formatCurrency(data.total_equity)} />
            <SummaryStat
              label="원숭이 보유 현금"
              value={formatCurrency(data.total_monkey_balance)}
            />
            <SummaryStat label="보유 종목 평가액" value={formatCurrency(data.total_holdings_value)} />
            <SummaryStat
              label="평균 수익률"
              value={formatPercent(data.average_earning_ratio)}
              valueClassName={signColorClass(data.average_earning_ratio)}
            />
            <SummaryStat
              label="최고 수익률"
              value={formatPercent(data.best_earning_ratio)}
              valueClassName={signColorClass(data.best_earning_ratio)}
            />
            <SummaryStat
              label="운영 중 원숭이"
              value={`${formatNumber(data.active_monkey_count)} / ${formatNumber(data.monkey_count)}`}
            />
            <SummaryStat
              label="정리 대기 자산"
              value={formatCurrency(data.system_balance + data.system_holdings_value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
