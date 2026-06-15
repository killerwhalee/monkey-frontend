import { useState } from 'react'
import { toast } from 'sonner'
import { MonkeyBulkCreateDialog } from '@/components/manage/monkey-bulk-create-dialog'
import { MonkeyCreateDialog } from '@/components/manage/monkey-create-dialog'
import { MonkeyDetailDialog } from '@/components/monkey-detail-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { SortableHead } from '@/components/ui/sortable-head'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useConfirm } from '@/hooks/use-confirm'
import { useForceKillMonkey, useMonkeys, useUpdateMonkey } from '@/hooks/use-monkeys'
import { useTableControls } from '@/hooks/use-table-controls'
import { getApiErrorDetail } from '@/lib/api-client'
import { formatCurrency, formatInterval, formatNumber, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Monkey } from '@/types/api'

export function MonkeyTable() {
  const { data: monkeys, isPending, isError } = useMonkeys()
  const updateMonkey = useUpdateMonkey()
  const forceKillMonkey = useForceKillMonkey()
  const confirm = useConfirm()
  const [selectedMonkeyId, setSelectedMonkeyId] = useState<number | null>(null)
  const selectedMonkey = monkeys?.find((monkey) => monkey.id === selectedMonkeyId) ?? null
  const activeMonkeys = monkeys?.filter((monkey) => monkey.killed_at === null)

  const controls = useTableControls<Monkey>({
    rows: activeMonkeys ?? [],
    columns: {
      name: (monkey) => monkey.name,
      is_active: (monkey) => (monkey.is_active ? 1 : 0),
      order_interval_seconds: (monkey) => monkey.order_interval_seconds,
      total_equity: (monkey) => monkey.metrics.total_equity,
      earning_ratio: (monkey) => monkey.metrics.earning_ratio,
      holdings: (monkey) => monkey.holdings.length,
    },
    searchAccessor: (monkey) => monkey.name,
    initialSortKey: 'name',
    initialSortDir: 'asc',
    initialPageSize: 10,
  })

  const activeCount = activeMonkeys?.filter((monkey) => monkey.is_active).length ?? 0
  const totalCount = activeMonkeys?.length ?? 0

  function handleToggleActive(monkey: Monkey, nextActive: boolean) {
    updateMonkey.mutate(
      { id: monkey.id, is_active: nextActive },
      {
        onSuccess: () => {
          toast.success(`'${monkey.name}'을(를) ${nextActive ? '활성화' : '비활성화'}했습니다.`)
        },
        onError: () => toast.error('상태 변경에 실패했습니다.'),
      },
    )
  }

  async function handleForceKill(monkey: Monkey) {
    const confirmed = await confirm({
      title: '원숭이 제거',
      description: `'${monkey.name}' 원숭이를 제거할까요? 보유 종목은 즉시 매도를 시도하며, 장이 닫혀 있으면 매도되지 않을 수 있습니다.`,
      confirmLabel: '강제 종료',
      variant: 'destructive',
    })
    if (!confirmed) return
    forceKillMonkey.mutate(monkey.id, {
      onSuccess: () =>
        toast.success(`'${monkey.name}' 원숭이를 제거했습니다. 보유 종목 매도를 시도했습니다.`),
      onError: (error) => toast.error(getApiErrorDetail(error) ?? '원숭이 제거에 실패했습니다.'),
    })
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>원숭이 관리</CardTitle>
          <CardDescription>
            전체 {formatNumber(totalCount)}마리 중 {formatNumber(activeCount)}마리 운영 중
          </CardDescription>
        </div>
        <div className="flex shrink-0 gap-2">
          <MonkeyCreateDialog />
          <MonkeyBulkCreateDialog />
          <Input
            placeholder="원숭이 이름으로 검색"
            value={controls.search}
            onChange={(event) => controls.setSearch(event.target.value)}
            className="sm:max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isError ? (
          <p className="py-10 text-center text-sm text-destructive">
            원숭이 목록을 불러오지 못했습니다.
          </p>
        ) : isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : activeMonkeys && activeMonkeys.length > 0 ? (
          <div className="flex flex-col gap-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead
                    sortKey="name"
                    label="이름"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <SortableHead
                    sortKey="is_active"
                    label="운영 상태"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <SortableHead
                    sortKey="order_interval_seconds"
                    label="거래 주기"
                    align="right"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <SortableHead
                    sortKey="total_equity"
                    label="총 자산"
                    align="right"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <SortableHead
                    sortKey="earning_ratio"
                    label="수익률"
                    align="right"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <SortableHead
                    sortKey="holdings"
                    label="보유 종목"
                    align="right"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {controls.rows.map((monkey) => (
                  <TableRow key={monkey.id}>
                    <TableCell className="font-medium">{monkey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={monkey.is_active}
                          onCheckedChange={(next) => handleToggleActive(monkey, next)}
                          disabled={updateMonkey.isPending}
                          aria-label={`${monkey.name} 운영 상태`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {monkey.is_active ? '운영 중' : '중단됨'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatInterval(monkey.order_interval_seconds)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatCurrency(monkey.metrics.total_equity)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-mono tabular-nums',
                        signColorClass(monkey.metrics.earning_ratio),
                      )}
                    >
                      {formatPercent(monkey.metrics.earning_ratio)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {monkey.holdings.length}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMonkeyId(monkey.id)}
                        >
                          자세히
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleForceKill(monkey)}
                          disabled={forceKillMonkey.isPending}
                        >
                          원숭이 제거
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              page={controls.page}
              pageCount={controls.pageCount}
              pageSize={controls.pageSize}
              total={controls.total}
              onPageChange={controls.setPage}
              onPageSizeChange={controls.setPageSize}
            />
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            아직 생성된 원숭이가 없습니다. 위 버튼으로 추가해 보세요.
          </p>
        )}
      </CardContent>
      <MonkeyDetailDialog
        monkey={selectedMonkey}
        open={selectedMonkeyId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMonkeyId(null)
        }}
        showAllOrders
      />
    </Card>
  )
}
