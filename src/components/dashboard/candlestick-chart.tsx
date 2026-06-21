import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import {
  type CandlestickData,
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type LogicalRange,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCandlesticks, useCandlesticks } from '@/hooks/use-candlesticks'
import { formatIndex, formatPercent, signColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CANDLE_UNITS, type CandleUnit, type Candlestick } from '@/types/api'

const SECONDS_PER_DAY = 86_400

interface HoverInfo {
  time: number
  open: number
  high: number
  low: number
  close: number
  dayOpen: number
}

const UNIT_LABELS: Record<CandleUnit, string> = {
  '1t': '1틱',
  '1m': '1분',
  '15m': '15분',
  '1h': '1시간',
  '4h': '4시간',
  '1d': '1일',
}

// Load older history once the user pans within this many bars of the left edge.
const LOAD_OLDER_THRESHOLD = 10

export function CandlestickChart() {
  const [unit, setUnit] = useState<CandleUnit>('1d')
  const { data, isPending } = useCandlesticks(unit)
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  // All candles loaded so far, keyed by `time` — dedupes the live tail (60s
  // poll) and older history pages. We draw the sorted values on every change.
  const mergedRef = useRef<Map<number, Candlestick>>(new Map())
  const renderedUnitRef = useRef<CandleUnit | null>(null)
  const loadingOlderRef = useRef(false)
  const noMoreOlderRef = useRef(false)
  const didFitRef = useRef(false)

  // Opening index value per trading day (KST), used as the hover-tooltip
  // percentage reference. Rebuilt whenever the data is drawn.
  const dayOpenRef = useRef<Map<number, number>>(new Map())
  const [hover, setHover] = useState<HoverInfo | null>(null)

  const applyData = useCallback(() => {
    const series = seriesRef.current
    if (!series) return
    const sorted = [...mergedRef.current.values()].sort((a, b) => a.time - b.time)
    // `time` already carries the KST offset, so flooring by day yields the local
    // trading day; the first (earliest) candle of each day is that day's open.
    const dayOpen = new Map<number, number>()
    for (const candle of sorted) {
      const dayKey = Math.floor(candle.time / SECONDS_PER_DAY)
      if (!dayOpen.has(dayKey)) dayOpen.set(dayKey, candle.open)
    }
    dayOpenRef.current = dayOpen
    series.setData(
      sorted.map((candle) => ({
        time: candle.time as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      })),
    )
  }, [])

  // Fetch and prepend older candles when the user nears the left edge.
  const loadOlder = useCallback(async () => {
    if (loadingOlderRef.current || noMoreOlderRef.current) return
    const times = [...mergedRef.current.keys()]
    if (times.length === 0) return
    const oldest = Math.min(...times)

    loadingOlderRef.current = true
    try {
      const older = await fetchCandlesticks(unit, { before: oldest })
      if (older.length === 0) {
        noMoreOlderRef.current = true
        return
      }
      let added = 0
      for (const candle of older) {
        if (!mergedRef.current.has(candle.time)) added += 1
        mergedRef.current.set(candle.time, candle)
      }
      if (added === 0) {
        noMoreOlderRef.current = true
      } else {
        // No fitContent — keep the user's current pan/zoom; lightweight-charts
        // anchors the visible range by time across setData.
        applyData()
      }
    } catch {
      // Leave the guards reset so a later pan retries.
    } finally {
      loadingOlderRef.current = false
    }
  }, [unit, applyData])

  // Keep the subscription handler pointed at the latest closure (current unit).
  const loadOlderRef = useRef(loadOlder)
  useEffect(() => {
    loadOlderRef.current = loadOlder
  }, [loadOlder])

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
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    })

    chartRef.current = chart
    seriesRef.current = series

    const handleRange = (range: LogicalRange | null) => {
      if (!range || !seriesRef.current) return
      const bars = seriesRef.current.barsInLogicalRange(range)
      if (bars && bars.barsBefore < LOAD_OLDER_THRESHOLD) {
        void loadOlderRef.current?.()
      }
    }
    chart.timeScale().subscribeVisibleLogicalRangeChange(handleRange)

    const handleCrosshair = (param: Parameters<Parameters<IChartApi['subscribeCrosshairMove']>[0]>[0]) => {
      const series = seriesRef.current
      if (!series || param.time === undefined || !param.point) {
        setHover(null)
        return
      }
      const candle = param.seriesData.get(series) as CandlestickData<Time> | undefined
      if (!candle || candle.open === undefined) {
        setHover(null)
        return
      }
      const time = param.time as number
      const dayKey = Math.floor(time / SECONDS_PER_DAY)
      setHover({
        time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        dayOpen: dayOpenRef.current.get(dayKey) ?? candle.open,
      })
    }
    chart.subscribeCrosshairMove(handleCrosshair)

    return () => {
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleRange)
      chart.unsubscribeCrosshairMove(handleCrosshair)
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [])

  useEffect(() => {
    const series = seriesRef.current
    if (!series) return

    // Switching unit resets the accumulator and pagination guards.
    if (renderedUnitRef.current !== unit) {
      renderedUnitRef.current = unit
      mergedRef.current.clear()
      loadingOlderRef.current = false
      noMoreOlderRef.current = false
      didFitRef.current = false
    }

    if (data) {
      for (const candle of data) mergedRef.current.set(candle.time, candle)
    }
    applyData()

    // Fit once per unit (initial load); later merges keep the user's pan/zoom.
    if (!didFitRef.current && mergedRef.current.size > 0) {
      chartRef.current?.timeScale().fitContent()
      didFitRef.current = true
    }
  }, [data, unit, applyData])

  const renderTooltip = (info: HoverInfo) => {
    const date = new Date(info.time * 1000)
    const pad = (n: number) => String(n).padStart(2, '0')
    const dateStr = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
    const timeStr = `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
    const header =
      unit === '1d'
        ? dateStr
        : unit === '1t'
          ? `${dateStr} ${timeStr}:${pad(date.getUTCSeconds())}`
          : `${dateStr} ${timeStr}`
    const rows: [string, number][] = [
      ['시가', info.open],
      ['종가', info.close],
      ['고가', info.high],
      ['저가', info.low],
    ]
    return (
      <div className="pointer-events-none absolute left-2 top-2 z-10 rounded-md border border-border/50 bg-background/90 px-2.5 py-1.5 text-xs shadow-sm backdrop-blur">
        <div className="mb-1 font-medium text-muted-foreground">{header}</div>
        <dl className="grid grid-cols-[auto_auto_auto] items-center gap-x-3 gap-y-0.5">
          {rows.map(([label, value]) => {
            const change = info.dayOpen ? value / info.dayOpen - 1 : 0
            return (
              <Fragment key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-mono tabular-nums">{formatIndex(value)}</dd>
                <dd
                  className={cn('text-right font-mono tabular-nums', signColorClass(change))}
                >
                  {formatPercent(change)}
                </dd>
              </Fragment>
            )
          })}
        </dl>
      </div>
    )
  }

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
          드래그·스크롤로 확대·이동할 수 있습니다
        </span>
      </div>
      <div className="relative h-80 w-full">
        <div ref={containerRef} className={cn('h-full w-full', isEmpty && 'opacity-0')} />
        {hover && !isEmpty ? renderTooltip(hover) : null}
        {isPending && !data ? (
          <Skeleton className="absolute inset-0" />
        ) : isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
            <p>아직 표시할 캔들이 없습니다.</p>
            <p>거래 시간 동안 가격이 업데이트될 때마다 기록이 쌓입니다.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
