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
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMonkeys } from '@/hooks/use-monkeys'
import { formatCurrency, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'

interface MonkeyListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MonkeyListDialog({ open, onOpenChange }: MonkeyListDialogProps) {
  const { data: monkeys, isPending, isError } = useMonkeys()
  const [selectedMonkeyId, setSelectedMonkeyId] = useState<number | null>(null)
  const selectedMonkey = monkeys?.find((monkey) => monkey.id === selectedMonkeyId) ?? null

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
          ) : monkeys && monkeys.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>운영 상태</TableHead>
                  <TableHead className="text-right">총 자산</TableHead>
                  <TableHead className="text-right">수익률</TableHead>
                  <TableHead className="text-right">상세</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monkeys.map((monkey) => (
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
