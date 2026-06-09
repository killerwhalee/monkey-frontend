import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatNumber, formatPercent, signColorClass } from '@/lib/format'
import { ORDER_STATUS_LABELS, ORDER_TYPE_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { Monkey } from '@/types/api'

interface MonkeyDetailDialogProps {
  monkey: Monkey | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DetailStat({
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

export function MonkeyDetailDialog({ monkey, open, onOpenChange }: MonkeyDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        {monkey ? (
          <>
            <DialogHeader>
              <DialogTitle>{monkey.name}</DialogTitle>
              <DialogDescription>
                #{monkey.id} · {monkey.is_active ? '운영 중' : '중단됨'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 sm:grid-cols-3">
              <DetailStat label="총 자산" value={formatCurrency(monkey.metrics.total_equity)} />
              <DetailStat label="현금 잔고" value={formatCurrency(monkey.metrics.cash_balance)} />
              <DetailStat
                label="보유 종목 평가액"
                value={formatCurrency(monkey.metrics.holdings_value)}
              />
              <DetailStat
                label="누적 손익"
                value={formatCurrency(monkey.metrics.total_pl)}
                valueClassName={signColorClass(monkey.metrics.total_pl)}
              />
              <DetailStat
                label="수익률"
                value={formatPercent(monkey.metrics.earning_ratio)}
                valueClassName={signColorClass(monkey.metrics.earning_ratio)}
              />
              <DetailStat label="초기 자본금" value={formatCurrency(monkey.initial_balance)} />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">보유 종목</h3>
              {monkey.holdings.length === 0 ? (
                <p className="text-sm text-muted-foreground">보유 중인 종목이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>종목</TableHead>
                      <TableHead className="text-right">수량</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monkey.holdings.map((holding) => (
                      <TableRow key={holding.id}>
                        <TableCell>
                          <div className="font-medium">{holding.stock.name}</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {holding.stock.ticker}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {formatNumber(holding.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">최근 주문 (최대 10건)</h3>
              {monkey.recent_orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">최근 주문 내역이 없습니다.</p>
              ) : (
                <ul className="flex flex-col gap-1.5 text-sm">
                  {monkey.recent_orders.map((order) => (
                    <li
                      key={order.id}
                      className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2"
                    >
                      <span className="truncate">
                        {ORDER_TYPE_LABELS[order.order_type]} · {order.stock.name} ·{' '}
                        {formatNumber(order.executed_quantity || order.requested_quantity)}주
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
