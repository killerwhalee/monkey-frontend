import { useState } from 'react';
import { MarketStatusBanner } from '@/components/dashboard/market-status-banner';
import { MonkeyListDialog } from '@/components/dashboard/monkey-list-dialog';
import { PerformanceChartCard } from '@/components/dashboard/performance-chart-card';
import { ProjectIntroSection } from '@/components/dashboard/project-intro-section';
import { RecentOrdersTable } from '@/components/dashboard/recent-orders-table';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardSummary } from '@/hooks/use-dashboard-summary';
import {
  formatInterval,
  formatNumber,
  formatPercent,
  signColorClass,
} from '@/lib/format';

export function DashboardPage() {
  const { data, isPending, isError } = useDashboardSummary();
  const [isMonkeyListOpen, setIsMonkeyListOpen] = useState(false);

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isPending || !data ? (
          <>
            <Skeleton className="h-28 w-full" />
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
              label="평균 주문 주기"
              value={formatInterval(data.average_order_interval_seconds)}
            />
            <StatCard
              label="원숭이 지수"
              value={formatNumber(Math.round(data.monkey_index))}
            />
            <StatCard
              label="전일 대비"
              value={formatPercent(data.monkey_index_change)}
              valueClassName={signColorClass(data.monkey_index_change)}
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
    </div>
  );
}
