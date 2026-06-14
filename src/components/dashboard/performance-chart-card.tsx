import { CandlestickChart } from '@/components/dashboard/candlestick-chart'
import { EarningRatioChart } from '@/components/dashboard/earning-ratio-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { DailyEarningRatioPoint } from '@/types/api'

interface PerformanceChartCardProps {
  dailySeries: DailyEarningRatioPoint[]
}

export function PerformanceChartCard({ dailySeries }: PerformanceChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>원숭이 지수</CardTitle>
        <CardDescription>
          전체 원숭이 평균 수익률의 추이와 캔들 차트를 함께 확인할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line" className="gap-4">
          <TabsList>
            <TabsTrigger value="line">수익률 그래프</TabsTrigger>
            <TabsTrigger value="candle">수익률 차트</TabsTrigger>
          </TabsList>
          <TabsContent value="line">
            <EarningRatioChart data={dailySeries} />
          </TabsContent>
          <TabsContent value="candle">
            <CandlestickChart />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
