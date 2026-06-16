import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AccountSummary } from '@/types/api'

interface KisAssetsCardProps {
  title?: string
  data?: AccountSummary
}

const ROW_LABELS = ['① 예수금', '② 보유 종목 평가액', '③ 총 평가자산 (①+②)', '④ 평가 손익', '수익률']

export function KisAssetsCard({ title = '전체 자산 현황', data }: KisAssetsCardProps) {
  const max = data ? Math.max(data.kis_total_assets, 1) : 1
  const cashShare = data ? (data.kis_cash_balance / max) * 100 : 0
  const holdingsShare = data ? (data.kis_holdings_value / max) * 100 : 0

  const rows: { label: string; value: string; className?: string }[] = data
    ? [
        { label: ROW_LABELS[0], value: formatCurrency(data.kis_cash_balance) },
        { label: ROW_LABELS[1], value: formatCurrency(data.kis_holdings_value) },
        { label: ROW_LABELS[2], value: formatCurrency(data.kis_total_assets) },
        {
          label: ROW_LABELS[3],
          value: formatCurrency(data.kis_total_pl),
          className: signColorClass(data.kis_total_pl),
        },
        {
          label: ROW_LABELS[4],
          value: formatPercent(data.kis_earning_rate),
          className: signColorClass(data.kis_earning_rate),
        },
      ]
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>KIS 모의투자 계좌의 실시간 잔고를 그대로 표시합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">총 평가자산</span>
            {data ? (
              <span className="font-mono tabular-nums">{formatCurrency(data.kis_total_assets)}</span>
            ) : (
              <Skeleton className="h-4 w-28" />
            )}
          </div>
          <div className="flex h-5 w-full overflow-hidden rounded-md bg-muted/40">
            {data ? (
              <>
                <div className="h-full bg-[var(--chart-1)]" style={{ width: `${cashShare}%` }} />
                <div className="h-full bg-[var(--chart-4)]" style={{ width: `${holdingsShare}%` }} />
              </>
            ) : (
              <Skeleton className="h-full w-full rounded-none" />
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {data ? (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full bg-[var(--chart-1)]" />
                  예수금 {formatCurrency(data.kis_cash_balance)} ({Math.round(cashShare)}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full bg-[var(--chart-4)]" />
                  보유 종목 {formatCurrency(data.kis_holdings_value)} ({Math.round(holdingsShare)}%)
                </span>
              </>
            ) : (
              <Skeleton className="h-3 w-48" />
            )}
          </div>
        </div>

        <Table>
          <TableBody>
            {data
              ? rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="text-muted-foreground">{row.label}</TableCell>
                    <TableCell className={cn('text-right font-mono tabular-nums', row.className)}>
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))
              : ROW_LABELS.map((label) => (
                  <TableRow key={label}>
                    <TableCell className="text-muted-foreground">{label}</TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
