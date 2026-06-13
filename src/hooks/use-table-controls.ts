import { useMemo, useState } from 'react'

export type SortDir = 'asc' | 'desc'

type SortValue = string | number | boolean

interface UseTableControlsOptions<T> {
  rows: T[]
  /** Column key → accessor returning the value to sort that column by. */
  columns: Record<string, (row: T) => SortValue>
  /** Accessor for the free-text search box (case-insensitive contains). */
  searchAccessor?: (row: T) => string
  initialSortKey?: string
  initialSortDir?: SortDir
  initialPageSize?: number
}

export interface TableControls<T> {
  rows: T[]
  total: number
  page: number
  pageCount: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  search: string
  setSearch: (value: string) => void
  sortKey: string | null
  sortDir: SortDir
  toggleSort: (key: string) => void
}

/**
 * Client-side sorting, searching and pagination over an in-memory array.
 * Shared by the manage monkey table, the dashboard monkey-list dialog and the
 * monkey order history so they all behave identically.
 */
export function useTableControls<T>({
  rows,
  columns,
  searchAccessor,
  initialSortKey,
  initialSortDir = 'asc',
  initialPageSize = 10,
}: UseTableControlsOptions<T>): TableControls<T> {
  const [search, setSearchState] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(initialSortKey ?? null)
  const [sortDir, setSortDir] = useState<SortDir>(initialSortDir)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const filtered = useMemo(() => {
    if (!search.trim() || !searchAccessor) return rows
    const needle = search.trim().toLowerCase()
    return rows.filter((row) => searchAccessor(row).toLowerCase().includes(needle))
  }, [rows, search, searchAccessor])

  const sorted = useMemo(() => {
    if (!sortKey || !columns[sortKey]) return filtered
    const accessor = columns[sortKey]
    const factor = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const av = accessor(a)
      const bv = accessor(b)
      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv, 'ko') * factor
      }
      return (Number(av) - Number(bv)) * factor
    })
  }, [filtered, columns, sortKey, sortDir])

  const total = sorted.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount)
  const paged = useMemo(
    () => sorted.slice((safePage - 1) * pageSize, safePage * pageSize),
    [sorted, safePage, pageSize],
  )

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  function setSearch(value: string) {
    setSearchState(value)
    setPage(1)
  }

  function setPageSize(size: number) {
    setPageSizeState(size)
    setPage(1)
  }

  return {
    rows: paged,
    total,
    page: safePage,
    pageCount,
    pageSize,
    setPage,
    setPageSize,
    search,
    setSearch,
    sortKey,
    sortDir,
    toggleSort,
  }
}
