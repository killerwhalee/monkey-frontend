import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'

interface AssetsTableProps {
  initialBalance: number
  cashBalance: number
  holdingsValue: number
  totalEquity: number
  totalPl: number
}

export function AssetsTable({
  initialBalance,
  cashBalance,
  holdingsValue,
  totalEquity,
  totalPl,
}: AssetsTableProps) {
  const rows: { label: string; value: string; className?: string }[] = [
    { label: '초기 자본금', value: formatCurrency(initialBalance) },
    { label: '보유 현금', value: formatCurrency(cashBalance) },
    { label: '보유 종목 평가액', value: formatCurrency(holdingsValue) },
    { label: '현재 평가자산', value: formatCurrency(totalEquity) },
    { label: '누적 손익', value: formatCurrency(totalPl), className: signColorClass(totalPl) },
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
