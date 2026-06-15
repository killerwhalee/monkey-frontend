import { AssetsCard } from '@/components/dashboard/assets-card'
import { FeedbackTable } from '@/components/manage/feedback-table'
import { IntervalScheduleCard } from '@/components/manage/interval-schedule-card'
import { KisTokenStatusCard } from '@/components/manage/kis-token-status-card'
import { MonkeyConfigCard } from '@/components/manage/monkey-config-card'
import { MonkeyTable } from '@/components/manage/monkey-table'
import { TaskControlCard } from '@/components/manage/task-control-card'
import { TaskScheduleCard } from '@/components/manage/task-schedule-card'
import { TradingControlCard } from '@/components/manage/trading-control-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboardSummary } from '@/hooks/use-dashboard-summary'

export function ManagePage() {
  const { data, isPending } = useDashboardSummary()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-mono text-2xl font-semibold tracking-tight">관리자</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          원숭이 운영, 전역 거래 스위치, KIS 접근 토큰 상태, 사용자 피드백을 관리합니다.
        </p>
      </div>

      <Tabs defaultValue="overview" className="gap-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="monkeys">원숭이</TabsTrigger>
          <TabsTrigger value="tasks">작업</TabsTrigger>
          <TabsTrigger value="kis">KIS</TabsTrigger>
          <TabsTrigger value="feedback">피드백</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex flex-col gap-6">
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
        </TabsContent>
        <TabsContent value="monkeys" className="flex flex-col gap-6">
          <MonkeyConfigCard />
          <MonkeyTable />
        </TabsContent>
        <TabsContent value="tasks" className="flex flex-col gap-6">
          <TaskControlCard />
          <TaskScheduleCard />
          <IntervalScheduleCard />
        </TabsContent>
        <TabsContent value="kis">
          <KisTokenStatusCard />
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
