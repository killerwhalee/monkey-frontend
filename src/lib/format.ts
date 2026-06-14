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

export function signColorClass(value: number): string {
  if (value > 0) return 'text-positive'
  if (value < 0) return 'text-destructive'
  return 'text-muted-foreground'
}
