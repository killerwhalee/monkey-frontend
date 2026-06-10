import { EarningRatioChart } from '@/components/dashboard/earning-ratio-chart'
import { ProjectIntroSection } from '@/components/dashboard/project-intro-section'
import { RecentOrdersTable } from '@/components/dashboard/recent-orders-table'
import { StatCard } from '@/components/dashboard/stat-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardSummary } from '@/hooks/use-dashboard-summary'
import { formatNumber, formatPercent, signColorClass } from '@/lib/format'

export function DashboardPage() {
  const { data, isPending, isError } = useDashboardSummary()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-center font-mono text-2xl font-semibold tracking-tight">원숭이 프로젝트</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          무작위로 거래하는 원숭이들의 현재 상태를 실시간으로 모니터링합니다.
        </p>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          대시보드 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {isPending ? (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        ) : (
          <>
            <StatCard label="현재 운영 중인 원숭이 수" value={formatNumber(data?.active_monkey_count ?? 0)} />
            <StatCard
              label="평균 원숭이 수익률"
              value={formatPercent(data?.average_earning_ratio ?? 0)}
              valueClassName={signColorClass(data?.average_earning_ratio ?? 0)}
            />
            <StatCard
              label="최고 원숭이 수익률"
              value={formatPercent(data?.best_earning_ratio ?? 0)}
              valueClassName={signColorClass(data?.best_earning_ratio ?? 0)}
            />
          </>
        )}
      </div>

      {isPending ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <EarningRatioChart data={data?.daily_earning_ratio_series ?? []} />
      )}

      {isPending ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <RecentOrdersTable orders={data?.latest_orders ?? []} />
      )}

      <ProjectIntroSection />
    </div>
  )
}
