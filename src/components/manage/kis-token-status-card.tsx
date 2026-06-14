import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useKisTokens } from '@/hooks/use-kis-tokens'
import { formatDateTime } from '@/lib/format'

export function KisTokenStatusCard() {
  const { data: tokens, isPending, isError } = useKisTokens()

  return (
    <Card>
      <CardHeader>
        <CardTitle>KIS 접근 토큰 상태</CardTitle>
        <CardDescription>
          한국투자증권 Open API 접근 토큰 현황입니다 (조회 전용 — 발급키는 서버 환경변수로 관리됩니다).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <p className="py-6 text-center text-sm text-destructive">
            토큰 정보를 불러오지 못했습니다.
          </p>
        ) : isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : tokens && tokens.length > 0 ? (
          <div className="flex flex-col gap-3">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between rounded-lg bg-muted/40 p-4 ring-1 ring-foreground/5"
              >
                <div>
                  <p className="font-mono text-sm font-medium uppercase tracking-wide">
                    {token.environment}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    갱신: {formatDateTime(token.updated_at)}
                  </p>
                </div>
                <Badge variant="outline" className="border-border text-foreground">
                  만료 {formatDateTime(token.expires_at)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            발급된 토큰 정보가 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
