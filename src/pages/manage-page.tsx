import { AccountsCard } from '@/components/manage/accounts-card'
import { FeedbackTable } from '@/components/manage/feedback-table'
import { IntervalScheduleCard } from '@/components/manage/interval-schedule-card'
import { KisAssetsCard } from '@/components/manage/kis-assets-card'
import { KisTokenStatusCard } from '@/components/manage/kis-token-status-card'
import { MonkeyConfigCard } from '@/components/manage/monkey-config-card'
import { MonkeyTable } from '@/components/manage/monkey-table'
import { TaskControlCard } from '@/components/manage/task-control-card'
import { TaskScheduleCard } from '@/components/manage/task-schedule-card'
import { TradingControlCard } from '@/components/manage/trading-control-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAccountSummary } from '@/hooks/use-account-summary'

export function ManagePage() {
  const { data: summaries, isPending: summariesPending } = useAccountSummary()

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
          <TabsTrigger value="accounts">계좌</TabsTrigger>
          <TabsTrigger value="monkeys">원숭이</TabsTrigger>
          <TabsTrigger value="tasks">작업</TabsTrigger>
          <TabsTrigger value="feedback">피드백</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex flex-col gap-6">
          {summariesPending ? (
            <Skeleton className="h-64 w-full" />
          ) : summaries && summaries.length > 0 ? (
            summaries.map((summary) => (
              <KisAssetsCard
                key={summary.account_id}
                title={`자산 현황 · ${summary.display_id}`}
                data={summary}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              등록된 계좌가 없습니다. ‘계좌’ 탭에서 KIS 계좌를 먼저 등록하세요.
            </p>
          )}
          <TradingControlCard />
        </TabsContent>
        <TabsContent value="accounts" className="flex flex-col gap-6">
          <AccountsCard />
          <KisTokenStatusCard />
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
        <TabsContent value="feedback">
          <FeedbackTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
