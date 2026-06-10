import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: ReactNode
  description?: ReactNode
  valueClassName?: string
  onClick?: () => void
}

export function StatCard({ label, value, description, valueClassName, onClick }: StatCardProps) {
  return (
    <Card
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        onClick &&
          'cursor-pointer transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
      )}
    >
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
