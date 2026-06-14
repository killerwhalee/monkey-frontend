import { useState } from 'react'
import { MonkeyDetailDialog } from '@/components/monkey-detail-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
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
import { useMonkeys } from '@/hooks/use-monkeys'
import { useTableControls } from '@/hooks/use-table-controls'
import { formatCurrency, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Monkey } from '@/types/api'

interface MonkeyListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MonkeyListDialog({ open, onOpenChange }: MonkeyListDialogProps) {
  const { data: monkeys, isPending, isError } = useMonkeys()
  const [selectedMonkeyId, setSelectedMonkeyId] = useState<number | null>(null)
  const selectedMonkey = monkeys?.find((monkey) => monkey.id === selectedMonkeyId) ?? null
  const activeMonkeys = monkeys?.filter((monkey) => monkey.killed_at === null)

  const controls = useTableControls<Monkey>({
    rows: activeMonkeys ?? [],
    columns: {
      name: (monkey) => monkey.name,
      is_active: (monkey) => (monkey.is_active ? 1 : 0),
      total_equity: (monkey) => monkey.metrics.total_equity,
      earning_ratio: (monkey) => monkey.metrics.earning_ratio,
    },
    searchAccessor: (monkey) => monkey.name,
    initialSortKey: 'total_equity',
    initialSortDir: 'desc',
    initialPageSize: 10,
  })

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>원숭이 목록</DialogTitle>
            <DialogDescription>각 원숭이의 자산 현황과 수익률을 확인할 수 있습니다.</DialogDescription>
          </DialogHeader>

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
            <>
              <Input
                placeholder="원숭이 이름으로 검색"
                value={controls.search}
                onChange={(event) => controls.setSearch(event.target.value)}
              />
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {controls.rows.map((monkey) => (
                    <TableRow key={monkey.id}>
                      <TableCell className="font-medium">{monkey.name}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {monkey.is_active ? '운영 중' : '중단됨'}
                        </span>
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
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedMonkeyId(monkey.id)}>
                          자세히
                        </Button>
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
            </>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              아직 생성된 원숭이가 없습니다.
            </p>
          )}
        </DialogContent>
      </Dialog>

      <MonkeyDetailDialog
        monkey={selectedMonkey}
        open={selectedMonkeyId !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setSelectedMonkeyId(null)
        }}
      />
    </>
  )
}
