import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMonkeyOrders } from '@/hooks/use-orders'
import { formatCurrency, formatNumber, formatPercent, signColorClass } from '@/lib/format'
import { ORDER_STATUS_LABELS, ORDER_TYPE_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { Monkey } from '@/types/api'

interface MonkeyDetailDialogProps {
  monkey: Monkey | null
  open: boolean
  onOpenChange: (open: boolean) => void
  showAllOrders?: boolean
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

export function MonkeyDetailDialog({
  monkey,
  open,
  onOpenChange,
  showAllOrders = false,
}: MonkeyDetailDialogProps) {
  const { data: allOrders, isPending: ordersPending } = useMonkeyOrders(
    monkey?.id ?? null,
    open && showAllOrders,
  )

  const orders = showAllOrders ? (allOrders ?? []) : (monkey?.recent_orders ?? [])
  const ordersTitle = showAllOrders
    ? `전체 주문 내역${allOrders ? ` (${formatNumber(allOrders.length)}건)` : ''}`
    : '최근 주문 (최대 10건)'

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
              <h3 className="mb-2 text-sm font-medium">{ordersTitle}</h3>
              {showAllOrders && ordersPending ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">주문 내역이 없습니다.</p>
              ) : (
                <ul className="flex flex-col gap-1.5 text-sm">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="flex items-start justify-between gap-2 rounded-md bg-muted/40 px-3 py-2"
                    >
                      <span className="break-words">
                        {ORDER_TYPE_LABELS[order.order_type]} · {order.stock.name} ·{' '}
                        {formatNumber(order.executed_quantity || order.requested_quantity)}주
                      </span>
                      <div className="flex w-2/5 shrink-0 flex-col items-end gap-0.5 text-right">
                        <span className="text-xs text-muted-foreground">
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                        {(order.status === 'failed' || order.status === 'skipped') &&
                          order.failure_reason && (
                            <span className="text-xs leading-tight break-words whitespace-normal text-muted-foreground/70">
                              {order.failure_reason}
                            </span>
                          )}
                      </div>
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
