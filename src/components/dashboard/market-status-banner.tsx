import { useEffect, useState } from 'react';
import { useGlobalControl } from '@/hooks/use-global-control';
import { cn } from '@/lib/utils';

const MARKET_OPEN_MINUTES = 9 * 60;
const MARKET_CLOSE_MINUTES = 15 * 60 + 30;
// The holiday-check task runs at 08:00 KST; before that today's holiday status
// is unknown, so we don't promise a market-open countdown yet.
const HOLIDAY_CHECK_MINUTES = 8 * 60;
// Only surface the close countdown inside the final hour of the session.
const CLOSE_COUNTDOWN_WINDOW_MINUTES = 60;

function StatusDot({ active, label }: { active: boolean; label: string }) {
	return (
		<span className="flex items-center gap-1">
			<span
				className={cn(
					'h-1.5 w-1.5 rounded-full',
					active ? 'bg-positive' : 'bg-muted-foreground',
				)}
			/>
			{label}
		</span>
	);
}

function formatDuration(ms: number): string {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return [hours, minutes, seconds]
		.map((value) => String(value).padStart(2, '0'))
		.join(':');
}

export function MarketStatusBanner() {
	const [now, setNow] = useState(() => new Date());
	const { data: control } = useGlobalControl();

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	const seoulDate = new Date(
		now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
	);
	const day = seoulDate.getDay();
	const minutes = seoulDate.getHours() * 60 + seoulDate.getMinutes();
	const isWeekend = day === 0 || day === 6;
	const isHoliday = isWeekend || control?.holiday_enabled === false;
	const isMarketOpen =
		!isHoliday &&
		minutes >= MARKET_OPEN_MINUTES &&
		minutes < MARKET_CLOSE_MINUTES;
	// Holiday status is only certain after the daily checker runs on a weekday.
	const holidayChecked = !isWeekend && minutes >= HOLIDAY_CHECK_MINUTES;

	const timeString = new Intl.DateTimeFormat('ko-KR', {
		timeZone: 'Asia/Seoul',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(now);

	const marketLabel = isHoliday ? '휴장일' : isMarketOpen ? '장 중' : '장 마감';

	let countdown: { label: string; remainingMs: number } | null = null;
	if (!isHoliday && !isMarketOpen && minutes < MARKET_OPEN_MINUTES && holidayChecked) {
		const target = new Date(seoulDate);
		target.setHours(9, 0, 0, 0);
		countdown = { label: '거래 시작까지', remainingMs: target.getTime() - seoulDate.getTime() };
	} else if (
		isMarketOpen &&
		minutes >= MARKET_CLOSE_MINUTES - CLOSE_COUNTDOWN_WINDOW_MINUTES
	) {
		const target = new Date(seoulDate);
		target.setHours(15, 30, 0, 0);
		countdown = { label: '거래 중단까지', remainingMs: target.getTime() - seoulDate.getTime() };
	}

	return (
		<div className="flex flex-col items-center gap-1 font-mono text-xs text-muted-foreground">
			<div className="text-[20px] text-foreground">{timeString} KST</div>
			<div className="flex items-center gap-2">
				<StatusDot active={isMarketOpen} label={marketLabel} />
				<StatusDot
					active={control?.enabled ?? false}
					label={control?.enabled ? '거래 중' : '거래 중단'}
				/>
			</div>
			{countdown ? (
				<span className="text-[11px] text-muted-foreground/70">
					{countdown.label} {formatDuration(countdown.remainingMs)}
				</span>
			) : null}
		</div>
	);
}
