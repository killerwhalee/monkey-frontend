import { useState } from 'react'
import { FeedbackDetailDialog } from '@/components/manage/feedback-detail-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { SortableHead } from '@/components/ui/sortable-head'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useFeedbackList } from '@/hooks/use-feedback'
import { useTableControls } from '@/hooks/use-table-controls'
import { formatDateTime } from '@/lib/format'
import type { Feedback } from '@/types/api'

export function FeedbackTable() {
  const { data: feedbackList, isPending, isError } = useFeedbackList()
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null)
  const selectedFeedback = feedbackList?.find((item) => item.id === selectedFeedbackId) ?? null

  const controls = useTableControls<Feedback>({
    rows: feedbackList ?? [],
    columns: {
      created_at: (item) => item.created_at,
      email: (item) => item.email,
      category: (item) => item.category_label,
      subject: (item) => item.subject,
      status: (item) => item.status_label,
    },
    searchAccessor: (item) => `${item.email} ${item.subject}`,
    initialSortKey: 'created_at',
    initialSortDir: 'desc',
    initialPageSize: 10,
  })

  const totalCount = feedbackList?.length ?? 0
  const newCount = feedbackList?.filter((item) => item.status === 'new').length ?? 0

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>피드백 관리</CardTitle>
          <CardDescription>
            전체 {totalCount}건 · 신규 {newCount}건
          </CardDescription>
        </div>
        <Input
          placeholder="이메일 또는 제목으로 검색"
          value={controls.search}
          onChange={(event) => controls.setSearch(event.target.value)}
          className="sm:max-w-xs"
        />
      </CardHeader>
      <CardContent>
        {isError ? (
          <p className="py-10 text-center text-sm text-destructive">
            피드백 목록을 불러오지 못했습니다.
          </p>
        ) : isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : controls.total > 0 ? (
          <div className="flex flex-col gap-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead
                    sortKey="created_at"
                    label="작성일"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <SortableHead
                    sortKey="email"
                    label="이메일"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <SortableHead
                    sortKey="category"
                    label="분류"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <SortableHead
                    sortKey="subject"
                    label="제목"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <SortableHead
                    sortKey="status"
                    label="상태"
                    activeKey={controls.sortKey}
                    direction={controls.sortDir}
                    onToggle={controls.toggleSort}
                  />
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {controls.rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono tabular-nums">
                      {formatDateTime(item.created_at)}
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category_label}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.subject}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'new' ? 'default' : 'secondary'}>
                        {item.status_label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFeedbackId(item.id)}
                      >
                        자세히
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              page={controls.page}
              pageCount={controls.pageCount}
              pageSize={controls.pageSize}
              total={controls.total}
              onPageChange={controls.setPage}
              onPageSizeChange={controls.setPageSize}
            />
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            아직 접수된 피드백이 없습니다.
          </p>
        )}
      </CardContent>
      <FeedbackDetailDialog
        feedback={selectedFeedback}
        open={selectedFeedbackId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedFeedbackId(null)
        }}
      />
    </Card>
  )
}
