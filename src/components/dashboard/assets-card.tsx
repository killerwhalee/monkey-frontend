import { AssetsBars } from '@/components/dashboard/assets-bars'
import { AssetsTable } from '@/components/dashboard/assets-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AssetsCardProps {
  title?: string
  initialBalance: number
  cashBalance: number
  holdingsValue: number
  totalEquity: number
  totalPl: number
  earningRatio: number
}

export function AssetsCard({
  title = '자산 현황',
  initialBalance,
  cashBalance,
  holdingsValue,
  totalEquity,
  totalPl,
  earningRatio,
}: AssetsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <AssetsBars
          initialBalance={initialBalance}
          cashBalance={cashBalance}
          holdingsValue={holdingsValue}
        />
        <AssetsTable
          initialBalance={initialBalance}
          cashBalance={cashBalance}
          holdingsValue={holdingsValue}
          totalEquity={totalEquity}
          totalPl={totalPl}
          earningRatio={earningRatio}
        />
      </CardContent>
    </Card>
  )
}
