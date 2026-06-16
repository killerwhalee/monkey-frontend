import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AccountSummary } from '@/types/api'

interface KisAssetsCardProps {
  title?: string
  data: AccountSummary
}

export function KisAssetsCard({ title = '전체 자산 현황', data }: KisAssetsCardProps) {
  const { kis_cash_balance, kis_holdings_value, kis_total_assets } = data
  const max = Math.max(kis_total_assets, 1)
  const cashShare = (kis_cash_balance / max) * 100
  const holdingsShare = (kis_holdings_value / max) * 100

  const rows: { label: string; value: string; className?: string }[] = [
    { label: '① 예수금', value: formatCurrency(kis_cash_balance) },
    { label: '② 보유 종목 평가액', value: formatCurrency(kis_holdings_value) },
    { label: '③ 총 평가자산 (①+②)', value: formatCurrency(kis_total_assets) },
    {
      label: '④ 평가 손익',
      value: formatCurrency(data.kis_total_pl),
      className: signColorClass(data.kis_total_pl),
    },
    {
      label: '수익률',
      value: formatPercent(data.kis_earning_rate),
      className: signColorClass(data.kis_earning_rate),
    },
  ]

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
            <span className="font-mono tabular-nums">{formatCurrency(kis_total_assets)}</span>
          </div>
          <div className="flex h-5 w-full overflow-hidden rounded-md bg-muted/40">
            <div
              className="h-full bg-[var(--chart-1)]"
              style={{ width: `${cashShare}%` }}
            />
            <div
              className="h-full bg-[var(--chart-4)]"
              style={{ width: `${holdingsShare}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-[var(--chart-1)]" />
              예수금 {formatCurrency(kis_cash_balance)} ({Math.round(cashShare)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-[var(--chart-4)]" />
              보유 종목 {formatCurrency(kis_holdings_value)} ({Math.round(holdingsShare)}%)
            </span>
          </div>
        </div>

        <Table>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="text-muted-foreground">{row.label}</TableCell>
                <TableCell
                  className={cn('text-right font-mono tabular-nums', row.className)}
                >
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
