import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, formatNumber } from '@/lib/format'
import { ORDER_STATUS_LABELS, ORDER_TYPE_LABELS } from '@/lib/labels'
import type { Order, OrderStatus } from '@/types/api'

const STATUS_CLASS: Record<OrderStatus, string> = {
  created: 'border-border text-muted-foreground',
  submitted: 'border-border text-foreground',
  skipped: 'border-border text-muted-foreground',
  succeeded: 'border-positive/30 bg-positive/10 text-positive',
  failed: 'border-destructive/30 bg-destructive/10 text-destructive',
}

interface RecentOrdersTableProps {
  orders: Order[]
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 주문 내역</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            아직 발생한 주문이 없습니다.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>종목</TableHead>
                <TableHead>유형</TableHead>
                <TableHead className="text-right">수량</TableHead>
                <TableHead className="text-right">가격</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">시각</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const price = order.executed_price ?? order.estimated_price ?? order.price
                const quantity = order.executed_quantity || order.requested_quantity
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.stock.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {order.stock.ticker}
                      </div>
                    </TableCell>
                    <TableCell>{ORDER_TYPE_LABELS[order.order_type]}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatNumber(quantity)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {price !== null ? formatNumber(price) : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Badge variant="outline" className={STATUS_CLASS[order.status]}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                        {(order.status === 'failed' || order.status === 'skipped') &&
                          order.failure_reason && (
                            <span className="max-w-[160px] truncate text-xs leading-tight text-muted-foreground">
                              {order.failure_reason}
                            </span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {formatDateTime(order.created_at)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
