import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Inline chip that marks a value as admin-configurable (it changes when the
 * monkey config / schedule is edited). Rendered as a monospace token on a soft
 * tinted background so readers notice it's a live, changeable setting.
 */
export function ConfigValue({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'mx-0.5 inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[0.95em] font-medium text-foreground tabular-nums',
        className,
      )}
      {...props}
    />
  )
}
