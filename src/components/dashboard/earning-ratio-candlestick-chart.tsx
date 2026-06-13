import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatDate, formatPercent } from '@/lib/format'
import type { EarningRatioCandlestick } from '@/types/api'

const chartConfig = {
  range: { label: '수익률', color: 'var(--chart-1)' },
} satisfies ChartConfig

const POSITIVE_COLOR = 'var(--positive)'
const NEGATIVE_COLOR = 'var(--destructive)'

interface CandlestickShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: EarningRatioCandlestick
}

function CandlestickShape({ x = 0, y = 0, width = 0, height = 0, payload }: CandlestickShapeProps) {
  if (!payload) return null

  const { open, high, low, close } = payload
  const color = close >= open ? POSITIVE_COLOR : NEGATIVE_COLOR
  const valueRange = high - low
  const scale = valueRange === 0 ? 0 : height / valueRange

  const bodyTop = y + (high - Math.max(open, close)) * scale
  const bodyHeight = Math.max((Math.max(open, close) - Math.min(open, close)) * scale, 1)
  const centerX = x + width / 2

  return (
    <g>
      <line x1={centerX} x2={centerX} y1={y} y2={y + height} stroke={color} strokeWidth={1} />
      <rect x={x} y={bodyTop} width={width} height={bodyHeight} fill={color} />
    </g>
  )
}

const TOOLTIP_ROWS = [
  ['시가', 'open'],
  ['고가', 'high'],
  ['저가', 'low'],
  ['종가', 'close'],
] as const

interface EarningRatioCandlestickChartProps {
  data: EarningRatioCandlestick[]
}

export function EarningRatioCandlestickChart({ data }: EarningRatioCandlestickChartProps) {
  const chartData = data.map((point) => ({ ...point, range: [point.low, point.high] }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>일별 원숭이 수익률 캔들차트</CardTitle>
        <CardDescription>
          1분마다 기록된 평균 수익률을 하루 단위 시가·고가·저가·종가로 표시합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
            <p>데이터 수집 중입니다.</p>
            <p>거래 시간 동안 1분마다 기록이 쌓이면 그래프가 채워집니다.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <ComposedChart data={chartData} margin={{ left: 8, right: 8 }}>
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
                domain={['auto', 'auto']}
                tickFormatter={(value: number) => formatPercent(value)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideIndicator
                    labelFormatter={(value) => formatDate(String(value))}
                    formatter={(_value, _name, item) => {
                      const point = item.payload as EarningRatioCandlestick
                      return (
                        <div className="grid w-full gap-1">
                          {TOOLTIP_ROWS.map(([label, key]) => (
                            <span
                              key={key}
                              className="flex w-full items-center justify-between gap-4"
                            >
                              <span className="text-muted-foreground">{label}</span>
                              <span className="font-mono font-medium tabular-nums">
                                {formatPercent(point[key])}
                              </span>
                            </span>
                          ))}
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar dataKey="range" shape={CandlestickShape} />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
