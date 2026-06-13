import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { formatDate, formatPercent } from '@/lib/format'
import type { DailyEarningRatioPoint } from '@/types/api'

const chartConfig = {
  average_earning_ratio: { label: '평균 수익률', color: 'var(--chart-1)' },
  best_earning_ratio: { label: '최고 수익률', color: 'var(--chart-2)' },
} satisfies ChartConfig

interface EarningRatioChartProps {
  data: DailyEarningRatioPoint[]
}

export function EarningRatioChart({ data }: EarningRatioChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
        <p>데이터 수집 중입니다.</p>
        <p>매일 자정에 새로운 기록이 쌓이면 그래프가 채워집니다.</p>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value: string) => formatDate(value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={64}
          tickFormatter={(value: number) => formatPercent(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatDate(String(value))}
              formatter={(value, name) => (
                <span className="flex w-full items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                  </span>
                  <span className="font-mono font-medium tabular-nums">
                    {formatPercent(Number(value))}
                  </span>
                </span>
              )}
            />
          }
        />
        <Line
          dataKey="average_earning_ratio"
          type="monotone"
          stroke="var(--color-average_earning_ratio)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="best_earning_ratio"
          type="monotone"
          stroke="var(--color-best_earning_ratio)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
