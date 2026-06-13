import { useState, type ReactNode } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { OrderRow } from '@/components/dashboard/recent-orders-table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { SortableHead } from '@/components/ui/sortable-head'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMonkeyOrders } from '@/hooks/use-orders'
import { useTableControls } from '@/hooks/use-table-controls'
import {
  formatCurrency,
  formatInterval,
  formatNumber,
  formatPercent,
  signColorClass,
} from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Holding, Monkey, Order } from '@/types/api'

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

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mb-2 flex w-full items-center justify-between gap-2 text-left"
      >
        <h3 className="text-sm font-medium">{title}</h3>
        <ChevronDownIcon
          className={cn('size-4 text-muted-foreground transition-transform', !open && '-rotate-90')}
        />
      </button>
      {open ? children : null}
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

  const holdings = useTableControls<Holding>({
    rows: monkey?.holdings ?? [],
    columns: {
      name: (holding) => holding.stock.name,
      quantity: (holding) => holding.quantity,
      average_price: (holding) => holding.average_price,
      current_price: (holding) => holding.current_price,
      profit: (holding) => holding.profit,
      profit_rate: (holding) => holding.profit_rate,
    },
    initialSortKey: 'profit_rate',
    initialSortDir: 'desc',
    initialPageSize: 10,
  })

  const rawOrders = showAllOrders ? (allOrders ?? []) : (monkey?.recent_orders ?? [])
  const succeededOrders = rawOrders.filter((order) => order.status === 'succeeded')
  const orders = useTableControls<Order>({
    rows: succeededOrders,
    columns: { created_at: (order) => order.created_at },
    initialSortKey: 'created_at',
    initialSortDir: 'desc',
    initialPageSize: 10,
  })

  const totalShares = (monkey?.holdings ?? []).reduce((sum, holding) => sum + holding.quantity, 0)

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
              <DetailStat label="거래 주기" value={formatInterval(monkey.order_interval_seconds)} />
            </div>

            <Section
              title={`보유 종목 ${formatNumber(monkey.holdings.length)}종 · 총 ${formatNumber(totalShares)}주`}
            >
              {monkey.holdings.length === 0 ? (
                <p className="text-sm text-muted-foreground">보유 중인 종목이 없습니다.</p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHead
                          sortKey="name"
                          label="종목"
                          activeKey={holdings.sortKey}
                          direction={holdings.sortDir}
                          onToggle={holdings.toggleSort}
                        />
                        <SortableHead
                          sortKey="quantity"
                          label="수량"
                          align="right"
                          activeKey={holdings.sortKey}
                          direction={holdings.sortDir}
                          onToggle={holdings.toggleSort}
                        />
                        <SortableHead
                          sortKey="average_price"
                          label="평균가"
                          align="right"
                          activeKey={holdings.sortKey}
                          direction={holdings.sortDir}
                          onToggle={holdings.toggleSort}
                        />
                        <SortableHead
                          sortKey="current_price"
                          label="현재가"
                          align="right"
                          activeKey={holdings.sortKey}
                          direction={holdings.sortDir}
                          onToggle={holdings.toggleSort}
                        />
                        <SortableHead
                          sortKey="profit"
                          label="평가손익"
                          align="right"
                          activeKey={holdings.sortKey}
                          direction={holdings.sortDir}
                          onToggle={holdings.toggleSort}
                        />
                        <SortableHead
                          sortKey="profit_rate"
                          label="수익률"
                          align="right"
                          activeKey={holdings.sortKey}
                          direction={holdings.sortDir}
                          onToggle={holdings.toggleSort}
                        />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holdings.rows.map((holding) => (
                        <TableRow key={holding.id}>
                          <TableCell>
                            <div className="flex items-center gap-1.5 font-medium">
                              {holding.stock.name}
                              {!holding.stock.is_active && (
                                <Badge variant="destructive">상장폐지</Badge>
                              )}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {holding.stock.ticker}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums">
                            {formatNumber(holding.quantity)}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums">
                            {formatNumber(holding.average_price)}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums">
                            {formatNumber(holding.current_price)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              'text-right font-mono tabular-nums',
                              signColorClass(holding.profit),
                            )}
                          >
                            {formatCurrency(holding.profit)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              'text-right font-mono tabular-nums',
                              signColorClass(holding.profit_rate),
                            )}
                          >
                            {formatPercent(holding.profit_rate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {holdings.pageCount > 1 ? (
                    <Pagination
                      page={holdings.page}
                      pageCount={holdings.pageCount}
                      pageSize={holdings.pageSize}
                      total={holdings.total}
                      onPageChange={holdings.setPage}
                      onPageSizeChange={holdings.setPageSize}
                    />
                  ) : null}
                </>
              )}
            </Section>

            <Section title={`체결 주문 ${formatNumber(succeededOrders.length)}건`}>
              {showAllOrders && ordersPending ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : succeededOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">체결된 주문이 없습니다.</p>
              ) : (
                <>
                  <ul className="flex flex-col gap-1.5">
                    {orders.rows.map((order) => (
                      <OrderRow key={order.id} order={order} showMonkey={false} />
                    ))}
                  </ul>
                  {orders.pageCount > 1 ? (
                    <Pagination
                      page={orders.page}
                      pageCount={orders.pageCount}
                      pageSize={orders.pageSize}
                      total={orders.total}
                      onPageChange={orders.setPage}
                      onPageSizeChange={orders.setPageSize}
                    />
                  ) : null}
                </>
              )}
            </Section>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
