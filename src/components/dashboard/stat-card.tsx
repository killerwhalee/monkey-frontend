import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: ReactNode
  description?: ReactNode
  valueClassName?: string
}

export function StatCard({ label, value, description, valueClassName }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className={cn('font-mono text-3xl font-semibold tabular-nums', valueClassName)}>
          {value}
        </CardTitle>
      </CardHeader>
      {description ? (
        <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
      ) : null}
    </Card>
  )
}
