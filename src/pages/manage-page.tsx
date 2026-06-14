import { AccountSummaryCard } from '@/components/admin/account-summary-card'
import { KisTokenStatusCard } from '@/components/manage/kis-token-status-card'
import { MonkeyTable } from '@/components/manage/monkey-table'
import { TradingControlCard } from '@/components/manage/trading-control-card'

export function ManagePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-mono text-2xl font-semibold tracking-tight">관리자</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          원숭이 운영, 전역 거래 스위치, KIS 접근 토큰 상태를 관리합니다.
        </p>
      </div>

      <AccountSummaryCard />
      <TradingControlCard />
      <MonkeyTable />
      <KisTokenStatusCard />
    </div>
  )
}
