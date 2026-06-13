import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatNumber } from '@/lib/format'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

interface PaginationProps {
  page: number
  pageCount: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>페이지당</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger size="sm" className="w-[4.5rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>개 · 총 {formatNumber(total)}건</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="이전 페이지"
        >
          <ChevronLeftIcon />
        </Button>
        <span className="tabular-nums">
          {page} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="다음 페이지"
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
