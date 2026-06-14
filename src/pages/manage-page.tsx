import { KisTokenStatusCard } from '@/components/manage/kis-token-status-card'
import { MonkeyTable } from '@/components/manage/monkey-table'
import { TradingControlCard } from '@/components/manage/trading-control-card'
import { AssetsCard } from '@/components/dashboard/assets-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardSummary } from '@/hooks/use-dashboard-summary'

export function ManagePage() {
  const { data, isPending } = useDashboardSummary()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-mono text-2xl font-semibold tracking-tight">관리자</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          원숭이 운영, 전역 거래 스위치, KIS 접근 토큰 상태를 관리합니다.
        </p>
      </div>

      {isPending || !data ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <AssetsCard
          title="전체 자산 현황"
          initialBalance={data.total_initial_balance}
          cashBalance={data.total_cash_balance}
          holdingsValue={data.total_holdings_value}
          totalEquity={data.total_equity}
          totalPl={data.total_pl}
          earningRatio={data.earning_ratio}
        />
      )}

      <TradingControlCard />
      <MonkeyTable />
      <KisTokenStatusCard />
    </div>
  )
}
