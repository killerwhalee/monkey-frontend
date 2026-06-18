import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'

interface AssetsTableProps {
  initialBalance: number
  cashBalance: number
  /** 주문가능금액: settled cash minus pending-buy reserves. Shown only when it
   * differs from cash (i.e. there are pending orders reserving funds). */
  availableCash?: number
  holdingsValue: number
  totalEquity: number
  totalPl: number
  earningRatio: number
}

export function AssetsTable({
  cashBalance,
  availableCash,
  holdingsValue,
  totalEquity,
  initialBalance,
  totalPl,
  earningRatio,
}: AssetsTableProps) {
  const rows: { label: string; value: string; className?: string }[] = [
    { label: '① 보유 현금', value: formatCurrency(cashBalance) },
    ...(availableCash !== undefined && availableCash !== cashBalance
      ? [
          {
            label: '· 주문가능금액',
            value: formatCurrency(availableCash),
            className: 'text-muted-foreground',
          },
        ]
      : []),
    { label: '② 보유 종목 평가액', value: formatCurrency(holdingsValue) },
    { label: '③ 현재 평가자산 (①+②)', value: formatCurrency(totalEquity) },
    { label: '④ 초기 자본금', value: formatCurrency(initialBalance) },
    { label: '⑤ 누적 손익 (③-④)', value: formatCurrency(totalPl), className: signColorClass(totalPl) },
    { label: '수익률', value: formatPercent(earningRatio), className: signColorClass(earningRatio) },
  ]

  return (
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
  )
}
