const currencyFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('ko-KR')

const percentFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'always',
})

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatPercent(ratio: number): string {
  return percentFormatter.format(ratio)
}

/** A 0–1 trait value (haste/balls) as a plain, unsigned percentage. */
export function formatTrait(value: number): string {
  return `${Math.round(value * 100)}%`
}

const indexFormatter = new Intl.NumberFormat('ko-KR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Monkey Index value, shown to 2 decimals (base 1,000.00). */
export function formatIndex(value: number): string {
  return indexFormatter.format(value)
}

export function formatDate(value: string): string {
  const date = new Date(value)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  return `${formatDate(value)} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatInterval(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(safe / 60)
  const remainder = safe % 60
  if (minutes === 0) return `${remainder}초`
  return `${minutes}분 ${remainder}초`
}

export function formatIntervalCompact(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(safe / 60)
  const remainder = safe % 60
  if (minutes === 0) return `${remainder}초`
  if (remainder === 0) return `${minutes}분`
  return `${minutes}분 ${remainder}초`
}

/** Like {@link formatIntervalCompact} but also rolls minutes up into hours. */
export function formatSeconds(seconds: number): string {
  const rounded = Math.round(seconds)
  if (rounded < 60) return `${rounded}초`
  const m = Math.floor(rounded / 60)
  const sec = rounded % 60
  if (m < 60) return sec > 0 ? `${m}분 ${sec}초` : `${m}분`
  const h = Math.floor(m / 60)
  const min = m % 60
  return min > 0 ? `${h}시간 ${min}분` : `${h}시간`
}

/**
 * Average interval between KIS API calls across the whole active fleet, given
 * `n` active monkeys each trading on a per-monkey interval drawn uniformly from
 * `[a, b]` seconds. The aggregate call rate is the sum of per-monkey rates, so
 * the mean call interval is the reciprocal of the mean rate: with intervals
 * uniform on `[a, b]`, E[1/T] = ln(b/a)/(b-a), giving (b-a)/(n·ln(b/a)).
 * Returns `null` for degenerate inputs.
 */
export function avgKisInterval(n: number, a: number, b: number): number | null {
  if (n <= 0 || a <= 0 || b <= 0 || a > b) return null
  if (a === b) return a / n
  return (b - a) / (n * Math.log(b / a))
}

export function formatHourMinute(
  value: { hour: number | null; minute: number | null } | undefined,
  fallback: string,
): string {
  if (!value || value.hour === null || value.minute === null) return fallback
  return `${pad(value.hour)}:${pad(value.minute)}`
}

export function signColorClass(value: number): string {
  if (value > 0) return 'text-positive'
  if (value < 0) return 'text-destructive'
  return 'text-muted-foreground'
}
