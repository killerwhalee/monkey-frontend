import { useState } from 'react';
import { MarketStatusBanner } from '@/components/dashboard/market-status-banner';
import { IndexReturnsDialog } from '@/components/dashboard/index-returns-dialog';
import { MonkeyListDialog } from '@/components/dashboard/monkey-list-dialog';
import { PerformanceChartCard } from '@/components/dashboard/performance-chart-card';
import { ProjectIntroSection } from '@/components/dashboard/project-intro-section';
import { RecentOrdersTable } from '@/components/dashboard/recent-orders-table';
import { StatCard } from '@/components/dashboard/stat-card';
import { TraitHistogramDialog } from '@/components/dashboard/trait-histogram-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardSummary } from '@/hooks/use-dashboard-summary';
import { useMonkeys } from '@/hooks/use-monkeys';
import {
  formatIndex,
  formatNumber,
  formatPercent,
  formatTrait,
  signColorClass,
} from '@/lib/format';

export function DashboardPage() {
  const { data, isPending, isError } = useDashboardSummary();
  const { data: monkeys } = useMonkeys();
  const [isMonkeyListOpen, setIsMonkeyListOpen] = useState(false);
  const [isTraitOpen, setIsTraitOpen] = useState(false);
  const [isReturnsOpen, setIsReturnsOpen] = useState(false);

  // Average traits over the living, non-system gene pool (matches the histogram
  // dialog's population). Shares the ['monkeys'] cache the list dialog uses.
  const aliveTraders =
    monkeys?.filter((monkey) => monkey.killed_at === null && !monkey.is_system) ?? [];
  const average = (select: (monkey: (typeof aliveTraders)[number]) => number) =>
    aliveTraders.length
      ? aliveTraders.reduce((sum, monkey) => sum + select(monkey), 0) / aliveTraders.length
      : 0;
  const avgHaste = average((monkey) => monkey.haste);
  const avgBalls = average((monkey) => monkey.balls);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-center font-mono text-2xl font-semibold tracking-tight">
          원숭이 프로젝트
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          무작위로 거래하는 원숭이들의 현재 상태를 실시간으로 모니터링합니다.
        </p>
      </div>

      <MarketStatusBanner />

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          대시보드 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isPending || !data ? (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        ) : (
          <>
            <StatCard
              label="운영 중인 원숭이"
              value={formatNumber(data.active_monkey_count)}
              onClick={() => setIsMonkeyListOpen(true)}
            />
            <StatCard
              label="원숭이 평균 성향"
              value={
                <span className="text-2xl">
                  성급함 {formatTrait(avgHaste)} · 배짱 {formatTrait(avgBalls)}
                </span>
              }
              onClick={() => setIsTraitOpen(true)}
            />
            <StatCard
              label="원숭이 지수"
              value={
                <span className="flex items-baseline gap-2">
                  {formatIndex(data.monkey_index)}
                  <span
                    className={`text-base font-normal ${signColorClass(data.monkey_index_change)}`}
                  >
                    {formatPercent(data.monkey_index_change)}
                  </span>
                </span>
              }
              onClick={() => setIsReturnsOpen(true)}
            />
          </>
        )}
      </div>

      {isPending || !data ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <PerformanceChartCard />
      )}

      {isPending || !data ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <RecentOrdersTable orders={data.latest_orders} />
      )}

      <ProjectIntroSection />

      <MonkeyListDialog
        open={isMonkeyListOpen}
        onOpenChange={setIsMonkeyListOpen}
      />

      <TraitHistogramDialog open={isTraitOpen} onOpenChange={setIsTraitOpen} />

      <IndexReturnsDialog open={isReturnsOpen} onOpenChange={setIsReturnsOpen} />
    </div>
  );
}
