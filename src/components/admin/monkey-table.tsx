import { useState } from 'react'
import { toast } from 'sonner'
import { MonkeyBulkCreateDialog } from '@/components/admin/monkey-bulk-create-dialog'
import { MonkeyCreateDialog } from '@/components/admin/monkey-create-dialog'
import { MonkeyDetailDialog } from '@/components/monkey-detail-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMonkeys, useUpdateMonkey } from '@/hooks/use-monkeys'
import { formatCurrency, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Monkey } from '@/types/api'

export function MonkeyTable() {
  const { data: monkeys, isPending, isError } = useMonkeys()
  const updateMonkey = useUpdateMonkey()
  const [selectedMonkeyId, setSelectedMonkeyId] = useState<number | null>(null)
  const selectedMonkey = monkeys?.find((monkey) => monkey.id === selectedMonkeyId) ?? null

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

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>원숭이 관리</CardTitle>
          <CardDescription>원숭이를 생성하거나 운영 상태를 관리합니다.</CardDescription>
        </div>
        <div className="flex shrink-0 gap-2">
          <MonkeyBulkCreateDialog />
          <MonkeyCreateDialog />
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
        ) : monkeys && monkeys.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>운영 상태</TableHead>
                <TableHead className="text-right">총 자산</TableHead>
                <TableHead className="text-right">수익률</TableHead>
                <TableHead className="text-right">보유 종목</TableHead>
                <TableHead className="text-right">상세</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monkeys.map((monkey) => (
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
                    <Button variant="ghost" size="sm" onClick={() => setSelectedMonkeyId(monkey.id)}>
                      자세히
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            아직 생성된 원숭이가 없습니다. 오른쪽 위 버튼으로 추가해 보세요.
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
