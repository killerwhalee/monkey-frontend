import { useState } from 'react'
import { AssetsBars } from '@/components/dashboard/assets-bars'
import { AssetsTable } from '@/components/dashboard/assets-table'
import { MarketStatusBanner } from '@/components/dashboard/market-status-banner'
import { MonkeyListDialog } from '@/components/dashboard/monkey-list-dialog'
import { PerformanceChartCard } from '@/components/dashboard/performance-chart-card'
import { ProjectIntroSection } from '@/components/dashboard/project-intro-section'
import { RecentOrdersTable } from '@/components/dashboard/recent-orders-table'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardSummary } from '@/hooks/use-dashboard-summary'
import { formatCurrency, formatInterval, formatNumber, formatPercent, signColorClass } from '@/lib/format'

export function DashboardPage() {
  const { data, isPending, isError } = useDashboardSummary()
  const [isMonkeyListOpen, setIsMonkeyListOpen] = useState(false)

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

      {isPending || !data ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>전체 자산 현황</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <AssetsBars
              initialBalance={data.total_initial_balance}
              cashBalance={data.total_cash_balance}
              holdingsValue={data.total_holdings_value}
            />
            <AssetsTable
              initialBalance={data.total_initial_balance}
              cashBalance={data.total_cash_balance}
              holdingsValue={data.total_holdings_value}
              totalEquity={data.total_equity}
              totalPl={data.total_pl}
            />
          </CardContent>
        </Card>
      )}

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
              label="누적 수익"
              value={formatCurrency(data.total_pl)}
              valueClassName={signColorClass(data.total_pl)}
            />
            <StatCard
              label="수익률"
              value={formatPercent(data.earning_ratio)}
              valueClassName={signColorClass(data.earning_ratio)}
            />
            <StatCard
              label="평균 주문 주기"
              value={formatInterval(data.average_order_interval_seconds)}
            />
          </>
        )}
      </div>

      {isPending || !data ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <PerformanceChartCard dailySeries={data.daily_earning_ratio_series} />
      )}

      {isPending || !data ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <RecentOrdersTable orders={data.latest_orders} />
      )}

      <ProjectIntroSection />

      <MonkeyListDialog open={isMonkeyListOpen} onOpenChange={setIsMonkeyListOpen} />
    </div>
  )
}
