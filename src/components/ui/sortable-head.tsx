import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'

import { TableHead } from '@/components/ui/table'
import type { SortDir } from '@/hooks/use-table-controls'
import { cn } from '@/lib/utils'

interface SortableHeadProps {
  sortKey: string
  label: string
  activeKey: string | null
  direction: SortDir
  onToggle: (key: string) => void
  className?: string
  align?: 'left' | 'right'
}

export function SortableHead({
  sortKey,
  label,
  activeKey,
  direction,
  onToggle,
  className,
  align = 'left',
}: SortableHeadProps) {
  const active = activeKey === sortKey
  const Icon = !active ? ArrowUpDownIcon : direction === 'asc' ? ArrowUpIcon : ArrowDownIcon

  return (
    <TableHead className={cn(align === 'right' && 'text-right', className)}>
      <button
        type="button"
        onClick={() => onToggle(sortKey)}
        className={cn(
          'inline-flex items-center gap-1 transition-colors hover:text-foreground',
          align === 'right' && 'flex-row-reverse',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
        <Icon className="size-3" />
      </button>
    </TableHead>
  )
}
