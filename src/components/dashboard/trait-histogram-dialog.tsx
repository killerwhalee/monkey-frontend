import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useMonkeys } from '@/hooks/use-monkeys'

interface TraitHistogramDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const BIN_COUNT = 20
const BIN_WIDTH = 100 / BIN_COUNT // 5%

// Bucket 0–1 trait values into twenty 5%-wide bins (1.0 lands in the top bin).
function histogram(values: number[]) {
  const bins = Array.from({ length: BIN_COUNT }, () => 0)
  for (const value of values) {
    const index = Math.min(BIN_COUNT - 1, Math.max(0, Math.floor(value * BIN_COUNT)))
    bins[index] += 1
  }
  return bins.map((count, i) => ({
    range: `${i * BIN_WIDTH}–${i * BIN_WIDTH + BIN_WIDTH}`,
    count,
  }))
}

const chartConfig = {
  count: { label: '원숭이 수' },
} satisfies ChartConfig

function TraitHistogram({
  title,
  values,
  color,
}: {
  title: string
  values: number[]
  color: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <ChartContainer config={chartConfig} className="aspect-auto h-48 w-full">
        <BarChart data={histogram(values)} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
          <ChartTooltip
            content={<ChartTooltipContent labelFormatter={(label) => `${label}%`} />}
          />
          <Bar dataKey="count" fill={color} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export function TraitHistogramDialog({ open, onOpenChange }: TraitHistogramDialogProps) {
  const { data: monkeys, isPending, isError } = useMonkeys()
  // Distribution over the living gene pool: alive (ACTIVE or INACTIVE), non-system.
  const aliveTraders =
    monkeys?.filter((monkey) => monkey.killed_at === null && !monkey.is_system) ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>원숭이 성향 분포</DialogTitle>
          <DialogDescription>
            살아 있는 원숭이들의 성급함·배짱 분포입니다. (총 {aliveTraders.length}마리)
          </DialogDescription>
        </DialogHeader>

        {isError ? (
          <p className="py-10 text-center text-sm text-destructive">
            원숭이 정보를 불러오지 못했습니다.
          </p>
        ) : isPending ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : aliveTraders.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            아직 살아 있는 원숭이가 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            <TraitHistogram
              title="성급함 (거래 빈도)"
              values={aliveTraders.map((monkey) => monkey.haste)}
              color="var(--chart-1)"
            />
            <TraitHistogram
              title="배짱 (거래 수량)"
              values={aliveTraders.map((monkey) => monkey.balls)}
              color="var(--chart-2)"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
