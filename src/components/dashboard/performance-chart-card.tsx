import { CandlestickChart } from '@/components/dashboard/candlestick-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function PerformanceChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>원숭이 지수</CardTitle>
        <CardDescription>
          10,000을 기준으로, 전일 종가 대비 오늘 원숭이들의 거래 성과를 캔들 차트로 보여줍니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CandlestickChart />
      </CardContent>
    </Card>
  )
}
