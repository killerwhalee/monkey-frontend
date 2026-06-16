import { useEffect, useRef, useState } from 'react'
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCandlesticks } from '@/hooks/use-candlesticks'
import { cn } from '@/lib/utils'
import { CANDLE_UNITS, type CandleUnit } from '@/types/api'

const UNIT_LABELS: Record<CandleUnit, string> = {
  '1m': '1분',
  '15m': '15분',
  '1h': '1시간',
  '4h': '4시간',
  '1d': '1일',
}

export function CandlestickChart() {
  const [unit, setUnit] = useState<CandleUnit>('1d')
  const { data, isPending } = useCandlesticks(unit)
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chart = createChart(el, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#71717a',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      localization: { dateFormat: 'yyyy-MM-dd' },
      crosshair: { mode: 0 },
    })
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#16a34a',
      downColor: '#dc2626',
      borderUpColor: '#16a34a',
      borderDownColor: '#dc2626',
      wickUpColor: '#16a34a',
      wickDownColor: '#dc2626',
      priceFormat: { type: 'price', precision: 0, minMove: 1 },
    })

    chartRef.current = chart
    seriesRef.current = series

    return () => {
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [])

  useEffect(() => {
    const series = seriesRef.current
    if (!series || !data) return
    series.setData(
      data.map((candle) => ({
        time: candle.time as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      })),
    )
    chartRef.current?.timeScale().fitContent()
  }, [data])

  const isEmpty = !!data && data.length === 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1">
        {CANDLE_UNITS.map((value) => (
          <Button
            key={value}
            size="xs"
            variant={value === unit ? 'secondary' : 'ghost'}
            onClick={() => setUnit(value)}
          >
            {UNIT_LABELS[value]}
          </Button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          드래그·스크롤로 확대·이동할 수 있습니다 (기준값: 10,000)
        </span>
      </div>
      <div className="relative h-80 w-full">
        <div ref={containerRef} className={cn('h-full w-full', isEmpty && 'opacity-0')} />
        {isPending && !data ? (
          <Skeleton className="absolute inset-0" />
        ) : isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
            <p>아직 표시할 캔들이 없습니다.</p>
            <p>거래 시간 동안 1분마다 기록이 쌓이면 채워집니다.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
