import { useEffect, useState } from 'react'
import { useGlobalControl } from '@/hooks/use-global-control'
import { cn } from '@/lib/utils'

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

export function MarketStatusClock() {
  const [now, setNow] = useState(() => new Date())
  const { data: control } = useGlobalControl()

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const seoulDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
  const day = seoulDate.getDay()
  const minutes = seoulDate.getHours() * 60 + seoulDate.getMinutes()
  const isMarketOpen = day >= 1 && day <= 5 && minutes >= 9 * 60 && minutes < 15 * 60 + 30

  const timeString = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span>{timeString} KST</span>
      <StatusDot active={isMarketOpen} label={isMarketOpen ? '장 중' : '장 마감'} />
      <StatusDot
        active={control?.enabled ?? false}
        label={control?.enabled ? '거래 중' : '거래 중단'}
      />
    </div>
  )
}
