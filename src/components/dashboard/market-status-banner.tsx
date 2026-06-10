import { useEffect, useState } from 'react'
import { useGlobalControl } from '@/hooks/use-global-control'
import { cn } from '@/lib/utils'

const MARKET_OPEN_MINUTES = 9 * 60
const MARKET_CLOSE_MINUTES = 15 * 60 + 30

function StatusDot({ active, label }: { active: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-positive' : 'bg-muted-foreground')}
      />
      {label}
    </span>
  )
}

function getNextTransition(seoulDate: Date): { label: string; remainingMs: number } {
  const day = seoulDate.getDay()
  const minutes = seoulDate.getHours() * 60 + seoulDate.getMinutes()
  const isWeekday = day >= 1 && day <= 5

  const target = new Date(seoulDate)
  target.setSeconds(0, 0)

  if (isWeekday && minutes < MARKET_OPEN_MINUTES) {
    target.setHours(9, 0, 0, 0)
    return { label: '거래 시작까지', remainingMs: target.getTime() - seoulDate.getTime() }
  }

  if (isWeekday && minutes < MARKET_CLOSE_MINUTES) {
    target.setHours(15, 30, 0, 0)
    return { label: '거래 중단까지', remainingMs: target.getTime() - seoulDate.getTime() }
  }

  do {
    target.setDate(target.getDate() + 1)
  } while (target.getDay() === 0 || target.getDay() === 6)
  target.setHours(9, 0, 0, 0)
  return { label: '거래 시작까지', remainingMs: target.getTime() - seoulDate.getTime() }
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}

export function MarketStatusBanner() {
  const [now, setNow] = useState(() => new Date())
  const { data: control } = useGlobalControl()

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const seoulDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
  const day = seoulDate.getDay()
  const minutes = seoulDate.getHours() * 60 + seoulDate.getMinutes()
  const isMarketOpen = day >= 1 && day <= 5 && minutes >= MARKET_OPEN_MINUTES && minutes < MARKET_CLOSE_MINUTES

  const timeString = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  const { label: countdownLabel, remainingMs } = getNextTransition(seoulDate)

  return (
    <div className="flex flex-col items-center gap-1 font-mono text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>{timeString} KST</span>
        <StatusDot active={isMarketOpen} label={isMarketOpen ? '장 중' : '장 마감'} />
        <StatusDot
          active={control?.enabled ?? false}
          label={control?.enabled ? '거래 중' : '거래 중단'}
        />
      </div>
      <span className="text-[11px] text-muted-foreground/70">
        {countdownLabel} {formatDuration(remainingMs)}
      </span>
    </div>
  )
}
