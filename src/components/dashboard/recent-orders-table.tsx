import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime, formatNumber } from '@/lib/format'
import { ORDER_TYPE } from '@/types/api'
import { ORDER_STATUS_LABELS, ORDER_TYPE_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { Order } from '@/types/api'

// Orders applied to the ledger (체결 완료); 'succeeded' is the legacy equivalent.
const FILLED_STATUSES = new Set<Order['status']>(['executed', 'succeeded'])

interface RecentOrdersTableProps {
  orders: Order[]
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const [open, setOpen] = useState(true)
  const succeeded = orders.filter((order) => FILLED_STATUSES.has(order.status))

  // Track which order ids we've already shown so freshly-pushed ones blink once.
  const mounted = useRef(false)
  const prevIds = useRef<Set<number>>(new Set())
  const [newIds, setNewIds] = useState<Set<number>>(new Set())
  useEffect(() => {
    const ids = new Set(succeeded.map((order) => order.id))
    let timer: ReturnType<typeof setTimeout> | undefined
    if (mounted.current) {
      // Skip the first render so existing rows don't all flash on initial load.
      const fresh = [...ids].filter((id) => !prevIds.current.has(id))
      if (fresh.length > 0) {
        setNewIds(new Set(fresh))
        timer = setTimeout(() => setNewIds(new Set()), 1500)
      }
    }
    mounted.current = true
    prevIds.current = ids
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [succeeded])

  return (
    <Card>
      <CardHeader>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <CardTitle>
            최근 체결 주문
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {formatNumber(succeeded.length)}건
            </span>
          </CardTitle>
          <ChevronDownIcon
            className={cn(
              'size-4 text-muted-foreground transition-transform',
              !open && '-rotate-90',
            )}
          />
        </button>
      </CardHeader>
      {open ? (
        <CardContent>
          {succeeded.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              아직 체결된 주문이 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {succeeded.map((order) => (
                <OrderRow key={order.id} order={order} isNew={newIds.has(order.id)} />
              ))}
            </ul>
          )}
        </CardContent>
      ) : null}
    </Card>
  )
}

export function OrderRow({
  order,
  showMonkey = true,
  isNew = false,
}: {
  order: Order
  showMonkey?: boolean
  isNew?: boolean
}) {
  const isBuy = order.order_type === ORDER_TYPE.BUY
  const isPending = order.status === 'submitted'
  const isFilled = FILLED_STATUSES.has(order.status)
  // A filled order that took less than it asked for is a partial fill.
  const isPartial =
    isFilled && order.executed_quantity > 0 && order.executed_quantity < order.requested_quantity
  const quantity = isPending
    ? order.requested_quantity
    : order.executed_quantity || order.requested_quantity

  return (
    <li
      className={cn(
        'flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2',
        isNew && 'blink-row',
      )}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{order.stock.name}</div>
        <div className="font-mono text-xs text-muted-foreground">
          {showMonkey ? `${order.monkey_name} · ` : ''}
          {formatDateTime(order.created_at)}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            'w-fit',
            isPending
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
              : 'border-muted-foreground/20 bg-muted text-muted-foreground',
          )}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            'w-fit',
            isBuy
              ? 'border-positive/30 bg-positive/10 text-positive'
              : 'border-destructive/30 bg-destructive/10 text-destructive',
          )}
        >
          {ORDER_TYPE_LABELS[order.order_type]}
        </Badge>
        <span className="font-mono text-sm tabular-nums">
          {isPartial
            ? `${formatNumber(order.executed_quantity)}/${formatNumber(order.requested_quantity)}주`
            : `${formatNumber(quantity)}주`}
        </span>
      </div>
    </li>
  )
}
