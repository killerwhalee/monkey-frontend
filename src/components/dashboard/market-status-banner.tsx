import { useEffect, useState } from 'react';
import { useGlobalControl } from '@/hooks/use-global-control';
import { useMarketHours } from '@/hooks/use-market-hours';
import { cn } from '@/lib/utils';

// Defaults until the live schedule loads (09:00 open / 15:30 close / 08:00 check).
const DEFAULT_OPEN_MINUTES = 9 * 60;
const DEFAULT_CLOSE_MINUTES = 15 * 60 + 30;
const DEFAULT_HOLIDAY_CHECK_MINUTES = 8 * 60;
// Only surface the close countdown inside the final hour of the session.
const CLOSE_COUNTDOWN_WINDOW_MINUTES = 60;

function toMinutes(
	value: { hour: number | null; minute: number | null } | undefined,
	fallback: number,
): number {
	if (!value || value.hour === null || value.minute === null) return fallback;
	return value.hour * 60 + value.minute;
}

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
	const { data: marketHours } = useMarketHours();

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	const openMinutes = toMinutes(marketHours?.open, DEFAULT_OPEN_MINUTES);
	const closeMinutes = toMinutes(marketHours?.close, DEFAULT_CLOSE_MINUTES);
	const holidayCheckMinutes = toMinutes(
		marketHours?.holiday_check,
		DEFAULT_HOLIDAY_CHECK_MINUTES,
	);

	const seoulDate = new Date(
		now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
	);
	const day = seoulDate.getDay();
	const minutes = seoulDate.getHours() * 60 + seoulDate.getMinutes();
	const isWeekend = day === 0 || day === 6;
	const isHoliday = isWeekend || control?.holiday_enabled === false;
	const isMarketOpen =
		!isHoliday && minutes >= openMinutes && minutes < closeMinutes;
	// Holiday status is only certain after the daily checker runs on a weekday.
	const holidayChecked = !isWeekend && minutes >= holidayCheckMinutes;

	const timeString = new Intl.DateTimeFormat('ko-KR', {
		timeZone: 'Asia/Seoul',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(now);

	const marketLabel = isHoliday ? '휴장일' : isMarketOpen ? '장 중' : '장 마감';

	let countdown: { label: string; remainingMs: number } | null = null;
	if (!isHoliday && !isMarketOpen && minutes < openMinutes && holidayChecked) {
		const target = new Date(seoulDate);
		target.setHours(Math.floor(openMinutes / 60), openMinutes % 60, 0, 0);
		countdown = { label: '거래 시작까지', remainingMs: target.getTime() - seoulDate.getTime() };
	} else if (
		isMarketOpen &&
		minutes >= closeMinutes - CLOSE_COUNTDOWN_WINDOW_MINUTES
	) {
		const target = new Date(seoulDate);
		target.setHours(Math.floor(closeMinutes / 60), closeMinutes % 60, 0, 0);
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
